"use client"

import { useEffect } from "react"

export default function SendAuthExtension(access_token: string) {
  useEffect(() => {
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
  }, [access_token])
}
