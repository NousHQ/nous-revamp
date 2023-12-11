"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import searchIcon from "@/public/searchIcon.svg"

import { Input } from "@/components/ui/input"

const useDebounce = (value: string | number, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<string | number>(value)
  const timerRef = useRef<NodeJS.Timeout>()

  //   useEffect(() => {
  //     timerRef.current = setTimeout(() => setDebouncedValue(value), delay)

  //     return () => {
  //       clearTimeout(timerRef.current)
  //     }
  //   }, [value, delay])

  //   return debouncedValue
  // }
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const debouncedValue = useDebounce(query, 500)

  // const triggerSearch = useCallback(() => {
  //   console.log("searching", debouncedValue)
  //   if (query.trim() === "") {
  //     router.replace(`/`)
  //   } else {
  //     router.replace(`/?q=${query.toString()}`)
  //   }

  // }, [debouncedValue])

  // useEffect(() => {
  //   triggerSearch()
  // }, [debouncedValue])

  useEffect(() => {
    if (debouncedValue) {
      router.replace(`/?q=${debouncedValue.toString()}`)
    } else {
      router.replace(`/`)
    }
  }, [debouncedValue, router])

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
      />
    </div>
  )
}
