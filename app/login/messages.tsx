"use client"

import { useSearchParams } from "next/navigation"

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const success = searchParams.get("success")

  return (
    <>
      {error && (
        <div className="mt-4">
          <div
            className="mt-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            role="alert"
          >
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </>
  )
}
