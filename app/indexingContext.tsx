"use client";
import React, { useContext, useState} from "react";

const IndexingContext = React.createContext({indexState: false})

export function useIndexingState() {
  return useContext(IndexingContext)
}

export function IndexingContextProvider({children}) {
  const [indexState, setIndexState] = useState(true)

  return (
    <IndexingContext.Provider value={{indexState}}>
        {children}
    </IndexingContext.Provider>
  )
}
