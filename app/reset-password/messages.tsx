"use client"

import { useSearchParams } from "next/navigation"

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const success = searchParams.get("success")

  return (
    <>
      {success && (
        <div className="mt-4">
          <div
            className="mt-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
            role="alert"
          >
            <p className="font-bold">{success}</p>
            <p>Please check your email.</p>
          </div>
        </div>
      )}
    </>
  )
}
