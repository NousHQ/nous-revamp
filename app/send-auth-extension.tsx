"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"

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

export default function SendAuthExtension({
  access_token,
  user,
}: {
  access_token: string
  user: User
}) {
  const [bookmarkTree, setBookmarkTree] = useState<ParsedFolder[]>([])
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const extExists = searchParams.has("ext")
  const router = useRouter()
  useEffect(() => {
    try {
      if (extExists && chrome.runtime !== undefined) {
        const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
        chrome.runtime.sendMessage(
          extensionId,
          { action: "getJWT", access_token: access_token },
          (response: any) => {
            if (!response) {
              console.log("no extension")
            } else {
              console.log(response)
            }
          }
        )
        // router.replace(`/`)
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
        router.replace(`/`)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }, [access_token, extExists])

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

  async function handleSubmit(): Promise<void> {
    const { data, error } = await supabase
      .from("all_user_bookmarks")
      .select("*")
      .eq("user_id", user?.id)
    if (Array.isArray(data) && data.length === 0) {
      const extractAllNodes = (
        node: ParsedLink | ParsedFolder
      ): ParsedLink | ParsedFolder | null => {
        if ("url" in node) {
          // It's a link
          return node
        } else {
          // It's a folder
          const children = node.links
            .map((child) => extractAllNodes(child))
            .filter(Boolean) as (ParsedLink | ParsedFolder)[]

          return {
            ...node,
            links: children,
          }
        }
      }
      const allNodes = bookmarkTree
        .map((node) => extractAllNodes(node))
        .filter(Boolean) as ParsedFolder[]

      const { data, error } = await supabase.from("all_user_bookmarks").insert({
        all_bookmarks: allNodes,
      })
    }
  }

  handleSubmit()
}
