"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import searchIcon from "@/public/searchIcon.svg"
import { Session } from "@supabase/auth-helpers-nextjs"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"

export default function SearchBar({ session }: { session: Session | null }) {
  useEffect(() => {
    const access_token = session?.access_token
    if (chrome.runtime !== undefined) {
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
    } else {
      console.log("Chrome extension API is not available.")
    }
  }, [session?.access_token])

  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleSubmit = useDebouncedCallback((term) => {
    // e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    console.log(term)
    replace(`/?${params.toString()}`)
  }, 200)

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
        onChange={(e) => {
          handleSubmit(e.target.value)
        }}
      />
    </div>
  )
}
