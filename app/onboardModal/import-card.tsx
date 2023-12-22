"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { User } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ToastAction } from "@/components/ui/toast"

type ParsedLink = {
  id: string
  name: string
  url: string
  checked: boolean
}

type ParsedFolder = {
  id: string
  name: string
  checked: boolean
  links: (ParsedLink | ParsedFolder)[]
  open: boolean
}

type BookmarkNodeProps = {
  node: ParsedLink | ParsedFolder
}

interface ImportCardProps {
  user: User | null
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  bookmarkTree: ParsedFolder[]
  setBookmarkTree: React.Dispatch<React.SetStateAction<ParsedFolder[]>>
  checkedCount: number
  setCheckedCount: React.Dispatch<React.SetStateAction<number>>
  maxCheckedCount: number | null
  fireToast: boolean
  setFireToast: React.Dispatch<React.SetStateAction<boolean>>
  toast: any // Replace ToastType with the actual type of your toast object
}

export default function ImportCard({
  user,
  name,
  setName,
  bookmarkTree,
  setBookmarkTree,
  checkedCount,
  setCheckedCount,
  maxCheckedCount,
  fireToast,
  setFireToast,
  toast,
}: ImportCardProps) {
  // First useEffect for handling the toast
  useEffect(() => {
    if (fireToast) {
      toast({
        title: "Want more? Get PRO!",
        description: "You can have upto 1000 bookmarks with the PRO version",
        action: (
          <ToastAction className="bg-green-9 text-green-12" altText="Get Pro.">
            <Link
              href={`https://nous.lemonsqueezy.com/checkout/buy/82a52c59-48db-430d-84de-122206ef2002?checkout[custom][user_id]=${user?.id}&checkout[email]=${user?.email}`}
            >
              Upgrade Now!
            </Link>
          </ToastAction>
        ),
        className: "bg-green-5 border-green-8 text-green-12",
      })
      setFireToast(false)
    }
  }, [fireToast, toast])

  // Second useEffect for handling the bookmarkTree state
  useEffect(() => {
    if (chrome.runtime !== undefined) {
      const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
      chrome.runtime.sendMessage(
        extensionId,
        { action: "getBookmarks" },
        (response: { bookmarks: chrome.bookmarks.BookmarkTreeNode[] }) => {
          const parsedTree = response.bookmarks.map((node) =>
            parseBookmarkTreeNode(node)
          )
          if (
            parsedTree.length > 0 &&
            "name" in parsedTree[0] &&
            !parsedTree[0].name
          ) {
            const firstNode = parsedTree[0] as ParsedFolder
            if ("open" in firstNode) {
              firstNode.open = false
            }
            firstNode.open = true
          }

          setBookmarkTree(parsedTree as ParsedFolder[])
        }
      )
    } else {
      console.log("Chrome extension API is not available.")
    }
  }, []) // Empty dependency array to run this effect only once on mount

  function parseBookmarkTreeNode(
    node: chrome.bookmarks.BookmarkTreeNode
  ): ParsedLink | ParsedFolder {
    if (node.children) {
      // It's a folder
      const folder: ParsedFolder = {
        id: node.id,
        name: node.title,
        checked: false,
        open: false,
        // partialChecked: false,
        links: node.children.map((childNode) =>
          parseBookmarkTreeNode(childNode)
        ),
      }
      return folder
    } else {
      // It's a link
      const link: ParsedLink = {
        id: node.id,
        name: node.title,
        url: node.url!,
        checked: false,
      }
      return link
    }
  }
  function checkAllChildren(
    node: ParsedLink | ParsedFolder,
    checked: boolean
  ): ParsedLink | ParsedFolder {
    if ("url" in node) {
      return { ...node, checked }
    } else {
      return {
        ...node,
        checked,
        links: node.links.map((child) => checkAllChildren(child, checked)),
      }
    }
  }
  function allChildrenChecked(links: (ParsedLink | ParsedFolder)[]): boolean {
    return links.every((link) => link.checked)
  }

  // function anyChildChecked(links: (ParsedLink | ParsedFolder)[]): boolean {
  //   return links.some(link => link.checked);
  // }

  function handleCheck(nodeId: string, checked: boolean): void {
    const countCheckedLinks = (
      nodes: (ParsedLink | ParsedFolder)[]
    ): number => {
      return nodes.reduce((acc, node) => {
        // Only count the node if it's a link and it's checked
        if ("url" in node && node.checked) {
          acc += 1
        }
        // If it's a folder, recursively count its children (which are links)
        if ("links" in node) {
          acc += countCheckedLinks(node.links)
        }
        return acc
      }, 0)
    }

    function updateNode(
      node: ParsedLink | ParsedFolder
    ): ParsedLink | ParsedFolder {
      if (node.id === nodeId) {
        return checkAllChildren(node, checked)
      } else if ("url" in node) {
        return node // unchanged for leaf nodes that don't match
      } else {
        const updatedLinks = node.links.map(updateNode)
        return {
          ...node,
          links: updatedLinks,
          checked: allChildrenChecked(updatedLinks),
          // partialChecked: !allChildrenChecked(updatedLinks) && anyChildChecked(updatedLinks)
        }
      }
    }
    setBookmarkTree((prevTree: ParsedFolder[]) => {
      const updatedTree = prevTree.map(updateNode) // Update the checked state in the tree
      const newCount = countCheckedLinks(updatedTree) // Count checked links in the updated tree
      if (maxCheckedCount !== null && newCount > maxCheckedCount) {
        setFireToast(true)
        return prevTree // Don't update the tree if the count exceeds 200
      }
      setCheckedCount(newCount) // Set the new count
      return updatedTree as ParsedFolder[] // Return the updated tree with explicit type casting
    })

    // setBookmarkTree(prevTree => prevTree.map(updateNode) as ParsedFolder[]);
  }

  // async function handleSubmit(): Promise<void> {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   const extractCheckedNodes = (
  //     node: ParsedLink | ParsedFolder
  //   ): ParsedLink | ParsedFolder | null => {
  //     if ("url" in node) {
  //       // It's a link
  //       return node.checked ? node : null
  //     } else {
  //       // It's a folder
  //       const checkedChildren = node.links
  //         .map((child) => extractCheckedNodes(child))
  //         .filter(Boolean) as (ParsedLink | ParsedFolder)[]

  //       if (node.checked || checkedChildren.length > 0) {
  //         return {
  //           ...node,
  //           links: checkedChildren,
  //         }
  //       }
  //       return null
  //     }
  //   }
  //   const checkedNodes = bookmarkTree
  //     .map((node) => extractCheckedNodes(node))
  //     .filter(Boolean) as ParsedFolder[]
  //   console.log(checkedNodes)
  //   console.log(session?.access_token)

  //   const { data, error } = await supabase
  //     .from("imported_bookmarks")
  //     .insert({
  //       bookmarks: checkedNodes,
  //       user_id: session?.user.id,
  //       num_imported: checkedCount,
  //       is_job_finished: false,
  //     })
  //     .select()

  //   if (error) {
  //     console.error(error)
  //   } else {
  //     console.log(data)
  //   }
  // }

  function toggleFolderOpen(nodeId: string, isOpen: boolean): void {
    function updateNodeOpenState(
      node: ParsedLink | ParsedFolder
    ): ParsedLink | ParsedFolder {
      if ("url" in node) {
        return node // unchanged for leaf nodes
      } else if (node.id === nodeId) {
        return { ...node, open: isOpen } // toggle open state for the matched folder
      } else {
        return { ...node, links: node.links.map(updateNodeOpenState) } // recursively update children
      }
    }

    setBookmarkTree(
      (prevTree: ParsedFolder[]) =>
        prevTree.map(updateNodeOpenState) as ParsedFolder[]
    )
  }

  // Modify the BookmarkNode component:

  const BookmarkNode: React.FC<BookmarkNodeProps> = ({ node }) => {
    if ("url" in node) {
      // Link
      return (
        <div className="flex justify-between align-middle items-center ml-5 bg-green-3 hover:bg-green-4 px-2 py-2 mb-0.5">
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-1 text-sm mr-4 overflow truncate max-w-[420px] hover:text-blue-600"
          >
            {node.name}
          </a>
          <Checkbox
            className="bg-sage-3 border border-sage-9 font-bold"
            checked={node.checked}
            onCheckedChange={() => handleCheck(node.id, !node.checked)}
          />
        </div>
      )
    } else {
      // Folder
      const childFolders = node.links.filter(
        (child) => "links" in child
      ) as ParsedFolder[]
      const childLinks = node.links.filter(
        (child) => "url" in child
      ) as ParsedLink[]
      return (
        <Collapsible
          open={node.open}
          onOpenChange={(newOpenState) =>
            toggleFolderOpen(node.id, newOpenState)
          }
        >
          <div className="flex items-center justify-between space-x-4 bg-green-3 hover:bg-green-4 px-2">
            <div className="flex justify-start">
              <CollapsibleTrigger asChild>
                <Button variant="ghost">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                  <h4 className="text-green-12 text-base font-semibold">
                    {node.name}
                  </h4>
                </Button>
              </CollapsibleTrigger>
            </div>
            <Checkbox
              className="bg-sage-3 border border-sage-9"
              checked={node.checked}
              onCheckedChange={() => handleCheck(node.id, !node.checked)}
            />
          </div>
          <Separator />
          <CollapsibleContent className="space-y-2">
            <div className="ml-5">
              {/* Render child folders first */}
              {childFolders.map((folder) => (
                <BookmarkNode key={folder.id} node={folder} />
              ))}
              {/* Render child links next */}
              {childLinks.map((link) => (
                <BookmarkNode key={link.id} node={link} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
  }

  return (
    <div className="flex flex-col items-center h-full max-h-full w-full">
      <ScrollArea className="flex-1 min-w-[620px] p-4 w-full max-h-[400px]">
        {bookmarkTree.map((node) => (
          <BookmarkNode key={node.id} node={node} />
        ))}
      </ScrollArea>
      <div className="flex flex-col p-2 text-sage-12 font-semibold text-sm text-center">
        <p>
          {checkedCount}/{maxCheckedCount} bookmarks selected.
        </p>
        <p>You can have 250 total bookmarks with the free version. </p>
      </div>
      {/* <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="submit">Save changes</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Select these bookmarks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will start downloading and indexing the selected bookmarks.
              They will slowly show up on the sidebar and you will be able to search them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  )
}
