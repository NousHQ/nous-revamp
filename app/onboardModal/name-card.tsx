"use client"
import { Input } from "@/components/ui/input"
import { useState, ChangeEvent } from "react";

export default function NameCard({
  handleNameChange
}: {
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {

  const [name, setName] = useState('');

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-green-700 text-lg font-semibold text-center">
        What's your name?
      </h3>
      <Input
        type="name"
        name="user_name"
        id="user_name"
        autoComplete="given-name"
        placeholder="Your name"
        onChange={handleNameChange}
        className="w-full text-center h-12 rounded-md border-0 ring-1 ring-gray-200 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-base"
      />
  </div>
  )
}