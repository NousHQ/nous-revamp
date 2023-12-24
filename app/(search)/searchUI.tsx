import { Key } from "react"
import Link from "next/link"

//Components
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <ScrollArea className="flex-grow overflow-auto rounded-md ">
        {bookmarks.map((bookmark: any) => (
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
        ))}
      </ScrollArea>
    </>
  )
}

export function SearchState({ searchResults }: SearchProps) {
  return (
    <ScrollArea className="h-fit p-4 flex flex-col flex-grow">
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
