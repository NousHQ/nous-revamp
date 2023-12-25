"use client"

import React, { useEffect, useState } from "react"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

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

interface SyncButtonProps {
  maxCheckedCount: number | null
}

export function SyncButton({ maxCheckedCount }: SyncButtonProps) {
  const supabase = createClientComponentClient()
  const [bookmarkTree, setBookmarkTree] = useState<ParsedFolder[]>([])
  const [checkedCount, setCheckedCount] = useState(0)
  const [fireToast, setFireToast] = useState(false)
  const { toast } = useToast()

  // First useEffect for handling the toast
  useEffect(() => {
    if (fireToast) {
      toast({
        title: "Want more? Get PRO!",
        description: "You can import upto 1000 bookmarks with the PRO version",
        action: (
          <ToastAction className="bg-white" altText="Get Pro.">
            Start your trial
          </ToastAction>
        ),
        className: "bg-white",
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

  async function handleSubmit(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const extractCheckedNodes = (
      node: ParsedLink | ParsedFolder
    ): ParsedLink | ParsedFolder | null => {
      if ("url" in node) {
        // It's a link
        return node.checked ? node : null
      } else {
        // It's a folder
        const checkedChildren = node.links
          .map((child) => extractCheckedNodes(child))
          .filter(Boolean) as (ParsedLink | ParsedFolder)[]

        if (node.checked || checkedChildren.length > 0) {
          return {
            ...node,
            links: checkedChildren,
          }
        }
        return null
      }
    }
    const checkedNodes = bookmarkTree
      .map((node) => extractCheckedNodes(node))
      .filter(Boolean) as ParsedFolder[]

    const { data, error } = await supabase
      .from("imported_bookmarks")
      .insert({
        bookmarks: checkedNodes,
        user_id: session?.user.id,
        num_imported: checkedCount,
        is_job_finished: false,
      })
      .select()

    if (error) {
      console.error(error)
    } else {
      console.log(data)
    }
    // console.log(session?.access_token)

    // const apiUrl = process.env.API_URL;
    // const response = await fetch(`${apiUrl}/api/import`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${session?.access_token}`,
    //   },
    //   body: JSON.stringify(checkedNodes),
    // })

    // const data = await response.json()
    // console.log(data)
    // If you want to save it to another state or variable:
    // setCheckedNodesState(checkedNodes);  // Assuming setCheckedNodesState is your useState setter function
  }

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
    <Dialog>
      {/* Check if there's an error and display it */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="p-3 m-2 text-white bg-green-9 hover:bg-green-10"
        >
          Sync Bookmarks
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-green-1 border-2 border-green-6 max-w-5xl h-[700px]">
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            {checkedCount}/{maxCheckedCount} Want more? Get PRO!
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-full rounded-md border p-4">
          {bookmarkTree.map((node) => (
            <BookmarkNode key={node.id} node={node} />
          ))}
        </ScrollArea>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="bg-green-3 border border-green-6"
                type="submit"
              >
                Save changes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-green-1">
              <AlertDialogHeader>
                <AlertDialogTitle>Select these bookmarks?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will start downloading and indexing the selected
                  bookmarks. They will slowly show up on the sidebar and you
                  will be able to search them.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-green-3">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-9 text-white hover:bg-green-10"
                  onClick={() => handleSubmit()}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
