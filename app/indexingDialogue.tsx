"use client"

import LinearProgress from "@mui/material/LinearProgress"

import { useIndexingState } from "@/app/indexingContext"

export default function IndexingDialogue() {
  const indexState = useIndexingState()

  return (
    <>
      {indexState.indexState === true && (
        <div className="bg-green-4 border border-green-10 p-2 mr-4 mt-6 rounded-xl">
          <div>
            <h3 className="text-sm mb-3 font-bold text-green-12">
              You can close this tab.
              <br />
              Your bookmarks will be indexed
              automatically.
            </h3>
            <LinearProgress color="info" />
          </div>
        </div>
      )}
    </>
  )
}
