"use client";
import React, { useContext, useState, ReactNode} from "react";

const IndexingContext = React.createContext({indexState: false})

export function useIndexingState() {
  return useContext(IndexingContext)
}

export function IndexingContextProvider({children}: {children: ReactNode}) {
  const [indexState, setIndexState] = useState(true)

  return (
    <IndexingContext.Provider value={{indexState}}>
        {children}
    </IndexingContext.Provider>
  )
}
