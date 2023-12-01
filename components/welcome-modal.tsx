"use client"

import React, { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import logo from "@/public/logo.png"
import { Transition } from "@headlessui/react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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

export default function WelcomeModal() {
  const supabase = createClientComponentClient()


  const [open, setOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [bookmarkTree, setBookmarkTree] = useState<ParsedFolder[]>([])
  const [checkedCount, setCheckedCount] = useState(0)
  const [fireToast, setFireToast] = useState(false)
  const { toast } = useToast()

  function handlePrevious() {
    setStep(step - 1)
  }
  function handleNext() {
    setStep(step + 1)
  }

  // First useEffect for handling the toast
  useEffect(() => {
    if (fireToast) {
      toast({
        title: "Want more? Get PRO!",
        description: "You can import upto 2000 bookmarks with the PRO version",
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
      if (newCount > 200) {
        setFireToast(true)
        return prevTree // Don't update the tree if the count exceeds 200
      }
      setCheckedCount(newCount) // Set the new count
      return updatedTree as ParsedFolder[] // Return the updated tree with explicit type casting
    })

    // setBookmarkTree(prevTree => prevTree.map(updateNode) as ParsedFolder[]);
  }

  async function handleSubmit(): Promise<void> {
    setStep(step + 1)
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
    console.log(checkedNodes)
    console.log(session?.access_token)

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

  const BookmarkNode: React.FC<BookmarkNodeProps> = ({ node }) => {
    if ("url" in node) {
      // Link
      return (
        <div className="flex justify-between ml-5 hover:bg-gray-200">
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-1 text-sm mr-4 overflow truncate h-full max-w-[420px] hover:text-blue-500"
          >
            {node.name}
          </a>
          <Checkbox
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
          <div className="flex items-center justify-between space-x-4">
            <div className="flex justify-start">
              <CollapsibleTrigger asChild>
                <Button variant="ghost">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                  <h4 className="text-base font-semibold">{node.name}</h4>
                </Button>
              </CollapsibleTrigger>
            </div>
            <Checkbox
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

  const [name, setName] = useState({
    user_name: "",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setName({
      ...name,
      [e.target.name]: e.target.value,
    })
  }

  const onFinished = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
    .from("user_profiles")
    .update({ user_name: name.user_name })
    .eq("id", user?.id)
    .select()
    setOpen(false)
  }

  return (
    <Transition show={open}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-8 space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-green-800 text-2xl font-bold">
                Let's get started.
              </h2>
              <Badge>{step}/7</Badge>
            </div>
            {/* {step === 1 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="flex flex-col items-center space-y-2">
                  <Image src={logo} alt="logo" className="w-12 h-12 m-4" />
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    Welcome to Nous!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    A search engine designed for you. Import your bookmarks,
                    screenshots, tweets to build up your index!
                  </p>
                </div>
              </Card>
            )} */}
            {step === 2 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    What's your name?
                  </h3>
                  {/* <p className="text-gray-500 dark:text-gray-400 text-center">
                    Please enter your name below to get started.
                  </p> */}
                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    autoComplete="given-name"
                    value={name.user_name}
                    placeholder="Your name"
                    onChange={handleChange}
                    className="w-full text-center h-12 rounded-md border-0 ring-1 ring-gray-200 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-base"
                  />
                </div>
              </Card>
            )}
            {step === 3 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    Import your bookmarks
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    We support importing from Chrome, Firefox, Safari, and Edge.
                  </p>
                </div>
              </Card>
            )}
            {step === 4 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="bg-white w-full h-full">
                  <p className="-mt-2">
                    Hey {name.user_name}! You have selected {checkedCount}/200
                    bookmarks Want more? Get PRO!
                  </p>
                  <ScrollArea className="max-h-full h-64 mt-2 rounded-md border p-4">
                    {bookmarkTree.map((node) => (
                      <BookmarkNode key={node.id} node={node} />
                    ))}
                  </ScrollArea>
                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="mt-3" type="submit">
                          Import Bookmarks
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Select these bookmarks?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will start downloading and indexing the
                            selected bookmarks. They will slowly show up on the
                            sidebar and you will be able to search them.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleSubmit()}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            )}
            {step === 5 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    Privacy and Security
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    To preserve privacy, we don't import webpages that are
                    behind authentication. Wanna import your private data?
                    <a href="">
                      <span className="font-semibold text-green-700">
                        {" "}
                        Reach out to me here!
                      </span>
                    </a>
                  </p>
                </div>
              </Card>
            )}
            {step === 6 && (
              <Card className="p-4 h-96">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    Here's how it works
                  </h3>
                  <iframe
                    className="rounded-xl w-full h-80"
                    src="https://www.youtube.com/embed/ygi7otUz18U"
                    title="Nous: A search engine for bookmarks."
                    allow="autoplay; encrypted-media;"
                  ></iframe>
                </div>
              </Card>
            )}
            {step === 7 && (
              <Card className="p-4 h-96 flex justify-around items-center">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-green-700 text-lg font-semibold text-center">
                    More features coming soon!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Bookmarks, Import from Pocket, Screenshot indexing & more!
                  </p>
                </div>
              </Card>
            )}

            <div className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Previous
                </Button>
              )}
              {step < 7 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={() => onFinished()}>Finish</Button>
              )}
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  )
}
