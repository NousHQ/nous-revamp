import React, { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function WelcomeModalCard({
  
  prevButtonState,
  nextButtonState,
  cardNumber,
  children,
  handleNext,
  handlePrev,
}: {
  prevButtonState: boolean
  nextButtonState: boolean
  cardNumber: number
  children: ReactNode
  handleNext: () => void
  handlePrev: () => void
}) {
  return (
    <div className="px-16 py-16 bg-green-1 w-full h-screen">
      <div className="mx-auto flex flex-col gap-4 h-full max-w-6xl">
        <div className="flex justify-between">
          <h2 className="text-green-12 text-2xl font-bold">
            Welcome to Nous!
          </h2>
          <Badge className="self-center">{cardNumber}/3</Badge>
        </div>
        <div className="h-full grid place-items-center border">
          <Card className="flex justify-around m-2 p-2 w-full h-full">
            {children}
          </Card>
        </div>
        <div className="flex justify-end">
          {/* {prevButtonState ? (
            <Button variant="outline" onClick={handlePrev}>
              Previous
            </Button>
          ) : (
            <Button disabled variant="outline">
              Previous
            </Button>
          )} */}
          {nextButtonState ? (
            <Button variant="outline" onClick={handleNext} className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 border-2 border-green-6">
              Next
            </Button>
          ) : (
            <Button disabled>Next</Button>
          )}
        </div>
      </div>
    </div>

    // <div className="grid place-items-center border border-red-800 bg-white rounded-lg w-full h-screen p-8">
    //   <div className="h-[60vh] w-[48rem] bg-red-400 mx-auto">
    //     <div className="w-full flex justify-between items-start border border-red-700">
    //     </div>
    // <Card className="  flex justify-around m-2 p-2 border border-wh">
    //     {children}
    // </Card>
    //     <div className="w-full flex justify-between">
    // {prevButtonState ? (
    //   <Button variant="outline" onClick={handlePrev}>Previous</Button>
    // ) : (
    //   <Button disabled variant="outline">
    //     Previous
    //   </Button>
    // )}
    // {nextButtonState ? (
    //   <Button variant="outline" onClick={handleNext}>Next</Button>
    // ) : (
    //   <Button disabled>Next</Button>
    // )}
    //     </div>
    //   </div>
    // </div>
  )
}
