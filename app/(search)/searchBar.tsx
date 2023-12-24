"use client"

// Dependencies
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
// Assets
import searchIcon from "@/public/searchIcon.svg"

// Components
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "@/app/(search)/searchFunction"
import { SearchState } from "@/app/(search)/searchUI"
import Loading from "@/app/loadingResults"

// Interface
interface SearchProps {
  access_token: string | undefined
}

interface SearchResult {
  id: string
  uri: string
  title: string
  // Add other properties as needed
}

export default function Search_Bar({ access_token }: SearchProps) {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [initState, setInitState] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isData, setIsData] = useState(true)

  console.log(query)
  // Search Bar Function Handler
  if (!query && !initState) {
    setInitState(true)
  }

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setInitState(false)
      setIsLoading(true)
      setSearchResults([])
      Search(query, access_token)
        .then((data) => {
          setSearchResults(data.results)
          setIsLoading(false)

          // Check if data is found or not
          if (data.results.length < 0) {
            setIsData(false)
          } else {
            setIsData(true)
          }
        })
        .catch((err) => {
          console.error(err)
          setIsError(true)
          setIsLoading(false)
        })
        .catch((err) => console.error(err))
    }
  }

  return (
    <div className="w-full mt-8 h-full">
      <div className="flex w-4/5 mx-auto items-center rounded-full">
        <Image
          src={searchIcon}
          alt="search"
          className="absolute h-6 w-6 mx-3"
        ></Image>
        <Input
          className="bg-greenA-3 hover:bg-greenA-4 focus:bg-greenA-5 pl-10 w-full text-xl font-semibold py-3 rounded-full ring-0 focus:ring-2 focus:ring-green-8 transition-all transform duration-300 ease-in-out"
          placeholder="Search..."
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <SearchState
          searchResults={searchResults}
          isData={isData}
          initState={initState}
        />
      )}
      {isError && (
        <div className="bg-red-200 mt-4 rounded-lg shadow-md p-4 mb-2">
          <h3 className="text-md font-medium dark:text-zinc-50">
            Something failed :/{" "}
          </h3>
          <Link
            className="text-green-12 underline"
            href="https://x.com/sidbing"
          >
            Tweet at me to let me know!
          </Link>
        </div>
      )}
    </div>
  )
}
