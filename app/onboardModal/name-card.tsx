"use client"

import { ChangeEvent, useState } from "react"

import { Input } from "@/components/ui/input"

export default function NameCard({
  handleNameChange,
}: {
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const [name, setName] = useState("")

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <h1 className="text-green-12 text-2xl font-semibold text-center">
        Let&apos;s make your knowledge accessible.
      </h1>
      <h3 className="text-green-12 text-base font-semibold text-center">
        What&apos;s your name?
      </h3>
      <Input
        type="name"
        name="user_name"
        id="user_name"
        autoComplete="given-name"
        placeholder="Your Name"
        onChange={handleNameChange}
        className="bg-green-3 w-1/2 text-center h-12 rounded-md border-0 ring-1 ring-sage-3 text-green-12 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sage-8 sm:text-base"
      />
    </div>
  )
}
