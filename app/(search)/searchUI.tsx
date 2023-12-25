import { Key } from "react"
import Image from "next/image"
import Link from "next/link"
import trash from "@/public/trash.svg"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
//Components
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteData } from "@/app/actions"

//Interface
interface SearchProps {
  searchResults: any
}

interface BookmarkProps {
  bookmarks: any
}

interface SearchResultsInterface {
  id: Key | null | undefined
  uri: string
  title: string | null | undefined
}

export function Bookmarks({ bookmarks }: BookmarkProps) {
  return (
    <>
      {bookmarks.length > 0 ? (
        <ScrollArea className="flex-grow overflow-auto rounded-md ">
          {bookmarks.map((bookmark: any) => (
            <ContextMenu key={bookmark.id}>
              <ContextMenuTrigger>
                <Link
                  key={bookmark.id}
                  href={bookmark.url}
                  target="_blank"
                  className="flex flex-col my-2 p-2 bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg mb-2 transition-all transform duration-300 ease-in-out shadow-md"
                >
                  <h2 className="text-md font-medium text-green-12">
                    {bookmark.title}
                  </h2>
                  <p className="text-sm text-neutral-500">{bookmark.url}</p>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-green-1 cursor-pointer rounded">
                <form action={deleteData} className="mx-auto">
                  <input type="hidden" name="id" value={bookmark.id} />
                  <button
                    type="submit"
                    className="flex items-center justify-around text-xs text-green-12 bg-green-1 gap-3 rounded-lg w-full"
                  >
                    <ContextMenuItem className="cursor-pointer">
                      <Image
                        src={trash}
                        alt="Delete"
                        className="text-green-12 h-3 w-3 mr-1"
                      />
                      Delete
                    </ContextMenuItem>
                  </button>
                </form>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </ScrollArea>
      ) : (
        <div>Bookmark using the extension!</div>
      )}
    </>
  )
}

export function SearchState({ searchResults }: SearchProps) {
  return (
    <ScrollArea className="h-fit flex flex-col flex-grow">
      {searchResults?.map((searchResult: SearchResultsInterface) => (
        <Link key={searchResult.id} href={searchResult.uri} target="_blank">
          <div className="flex flex-col my-2 p-2 bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg mb-2 transition-all transform duration-300 ease-in-out shadow-md">
            <h2 className="text-md font-medium text-green-12">
              {searchResult.title}
            </h2>
            <p className="text-sm text-neutral-500">{searchResult.uri}</p>
          </div>
        </Link>
      ))}
    </ScrollArea>
  )
}
