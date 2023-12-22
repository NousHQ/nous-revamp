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
import Loading from "@/app/loadingResults"

// Interface
interface SearchProps {
  access_token: string | undefined
}

export default function Search_Bar({ access_token }: SearchProps) {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setIsLoading(true)
      setSearchResults([])
      Search(query, access_token)
        .then((data) => {
          setSearchResults(data)
          setIsLoading(false)
        })
        .catch((err) => console.error(err))
    }
  }

  return (
    <div className="w-3/5 mx-auto mt-16 h-full">
      <div className="flex items-center rounded-full">
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
        <ScrollArea className="h-fit p-4 flex flex-col flex-grow">
          {searchResults.results?.map((searchResult) => (
            <Link key={searchResult.id} href={searchResult.uri} target="_blank">
              <div className="flex flex-col my-2 p-2 rounded-l bg-green-100 hover:bg-green-200 transition-all transform duration-300 ease-in-out shadow-md">
                <h2 className="text-md font-medium text-green-12">
                  {searchResult.title}
                </h2>
                <p className="text-sm text-neutral-500">{searchResult.uri}</p>
              </div>
            </Link>
          ))}
        </ScrollArea>
      )}
    </div>
  )
}
