import React, { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function WelcomeModalCard({
  prevButtonState,
  nextButtonState,
  cardNumber,
  children,
}: {
  prevButtonState: boolean
  nextButtonState: boolean
  cardNumber: number
  children: ReactNode
}) {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg w-full h-full p-8">
      <div className="w-full flex justify-between items-start">
        <h2 className="text-green-800 text-2xl font-bold">
          Let's get started.
        </h2>
        <Badge className="self-center">{cardNumber}/7</Badge>
      </div>

      <Card className="h-full w-full flex justify-around m-2 p-2">
        <div className="flex flex-col justify-around items-center">
          {children}
        </div>
      </Card>
      <div className="w-full flex justify-between">
        {prevButtonState ? (
          <Button variant="outline">Previous</Button>
        ) : (
          <Button disabled variant="outline">
            Previous
          </Button>
        )}
        {nextButtonState ? (
          <Button>Next</Button>
        ) : (
          <Button disabled>Next</Button>
        )}
      </div>
    </div>
  )
}
