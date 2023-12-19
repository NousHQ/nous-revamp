"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SendAuthExtension({
  access_token,
}: {
  access_token: string
}) {
  const searchParams = useSearchParams()
  const extExists = searchParams.has("ext")
  const router = useRouter()
  useEffect(() => {
    try {
      if (extExists && chrome.runtime !== undefined) {
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
        router.replace(`/`)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }, [access_token, extExists])
}
