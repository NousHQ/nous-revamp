"use client";
import LinearProgress from "@mui/material/LinearProgress";
import {useIndexingState} from "@/app/indexingContext";

export default function IndexingDialogue(){
    const indexState = useIndexingState()

    return(
        <>
            {(indexState.indexState === true) &&
                <>
                    <h3 className="text-sm mb-3 font-bold text-white">You can close this tab. Your bookmarks will be indexed automatically</h3>
                    <LinearProgress color="info"/>
                </>
            }
        </>
    )
}
