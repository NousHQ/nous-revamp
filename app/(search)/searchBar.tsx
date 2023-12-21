"use client"

// Dependencies
import { useState } from "react"
import Image from "next/image"
// Assets
import searchIcon from "@/public/searchIcon.svg"

// Components
import { Input } from "@/components/ui/input"
import { Search } from "@/app/(search)/searchFunction"

// Interface
interface SearchProps {
  searchQuery: string
  access_token: string | undefined
}

export default function Search_Bar({ searchQuery, access_token }: SearchProps) {
  const [query, setQuery] = useState("")
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      Search(query, access_token)
    }
    console.log(access_token)
  }

  return (
    <div className="w-3/4 mx-auto mt-16 flex items-center rounded-full">
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
  )
}
