"use client"

import Image from "next/image"
import trash from "@/public/trash.svg"
import { useFormStatus } from "react-dom"

export function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" aria-disabled={pending}>
      <Image
        src={trash}
        alt="Delete"
        className="opacity-30 hover:opacity-75 ml-3 cursor-pointer"
      />
    </button>
  )
}
