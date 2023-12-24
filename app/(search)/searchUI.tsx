import { Key } from "react"
import Link from "next/link"

//Components
import { ScrollArea } from "@/components/ui/scroll-area"

//Interface
interface Props {
  searchResults: any
  initState: boolean
  isData: boolean
}

interface SearchResultsInterface {
  id: Key | null | undefined
  uri: string
  title: string | null | undefined
}

export const SearchState: React.FC<Props> = ({
  searchResults,
  initState,
  isData,
}) => {
  console.log("INIT STATE " + initState)
  return (
    <div>
      {initState ? (
        <div>Init Screen</div>
      ) : (
        <>
          {isData ? (
            <ScrollArea className="h-fit mx-auto max-w-5xl p-4 flex flex-col flex-grow">
              {searchResults?.map((searchResult: SearchResultsInterface) => (
                <Link
                  key={searchResult.id}
                  href={searchResult.uri}
                  target="_blank"
                >
                  <div className="flex flex-col my-2 p-2 bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg mb-2 transition-all transform duration-300 ease-in-out shadow-md">
                    <h2 className="text-md font-medium text-green-12">
                      {searchResult.title}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {searchResult.uri}
                    </p>
                  </div>
                </Link>
              ))}
            </ScrollArea>
          ) : (
            <div className="bg-green-3 my-4 text-green-12 rounded-lg shadow-lg p-4 mb-2">
              <h3 className="text-md font-medium dark:text-zinc-50">
                No results found :/{" "}
              </h3>
            </div>
          )}
        </>
      )}
    </div>
  )
}
