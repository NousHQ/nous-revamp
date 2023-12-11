"use client"

import { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

export default function SendAuthExtension(access_token: string) {
  const searchParams = useSearchParams();
  const extExists = searchParams.has('ext');
  const router = useRouter()
  useEffect(() => {
    if (extExists && chrome.runtime !== undefined) {
      const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
      chrome.runtime.sendMessage(
        extensionId,
        { action: "getJWT", access_token: access_token },
        (response: any) => {
          if (!response) {
            console.log("no extension");
          } else {
            console.log(response);
          }
        }
      );
      router.replace(`/`);
    } else {
      console.log("Chrome extension API is not available.");
    }
  }, [access_token, extExists]);
}
