import React, { useContext, useState } from "react"

type CardNumberContextProviderProps = {
  children: React.ReactNode
}

const CardNumberContext = React.createContext<number | null>(null)

const CardNumberUpdateContext = React.createContext<React.Dispatch<
  React.SetStateAction<number>
> | null>(null)

export default function WelcomeModalCardContextProvider({
  children,
}: CardNumberContextProviderProps) {
  const [cardNumber, setCardNumber] = useState(1)

  return (
    <CardNumberContext.Provider value={cardNumber}>
      <CardNumberUpdateContext.Provider value={setCardNumber}>
        {children}
      </CardNumberUpdateContext.Provider>
    </CardNumberContext.Provider>
  )
}

export function useCardNumber() {
  const context = useContext(CardNumberContext)

  if (context === undefined) {
    throw new Error(
      "useCardNumber must be used within a CardNumberContextProvider"
    )
  }

  return context
}

export function useCardNumberUpdate() {
  const context = useContext(CardNumberUpdateContext)

  if (context === undefined) {
    throw new Error(
      "useCardNumberUpdate must be used within a CardNumberContextProvider"
    )
  }

  return context
}
