"use client"

import { useState } from "react"
import Image from "next/image"
import logo from "@/public/logo.png"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function WelcomeModal() {
  const [step, setStep] = useState(1)

  function handlePrevious() {
    setStep(step - 1)
  }
  function handleNext() {
    setStep(step + 1)
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-green-800 text-2xl font-bold">Welcome Guide</h2>
          <Badge>{step}/5</Badge>
        </div>
        {step === 1 && (
          <Card className="p-4 h-96 flex justify-around items-center">
            <div className="flex flex-col items-center space-y-2">
              <Image src={logo} alt="logo" className="w-12 h-12 m-4" />
              <h3 className="text-green-700 text-lg font-semibold text-center">
                Welcome to Nous!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                A search engine designed for you. Import your bookmarks,
                screenshots, tweets to build up your index!
              </p>
            </div>
          </Card>
        )}
        {step === 2 && (
          <Card className="p-4 h-96 flex justify-around items-center">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-green-700 text-lg font-semibold text-center">
                Import your bookmarks
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                We support importing from Chrome, Firefox, Safari, and Edge.
              </p>
            </div>
          </Card>
        )}
        {step === 3 && (
          <Card className="p-4 h-96 flex justify-around items-center">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-green-700 text-lg font-semibold text-center">
                Privacy and Security
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                To preserve privacy, we don't import webpages that are behind
                authentication. Wanna import your private data? Reach out to me
                here!
              </p>
            </div>
          </Card>
        )}
        {step === 4 && (
          <Card className="p-4 h-96">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-green-700 text-lg font-semibold text-center">
                Here's how it works
              </h3>
              <iframe
                className="rounded-xl w-full h-80"
                src="https://www.youtube.com/embed/ygi7otUz18U"
                title="Nous: A search engine for bookmarks."
                allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
              ></iframe>
            </div>
          </Card>
        )}
        {step === 5 && (
          <Card className="p-4 h-96 flex justify-around items-center">
            <div className="flex flex-col items-center space-y-2">
              <h3 className="text-green-700 text-lg font-semibold text-center">
                More features coming soon!
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Bookmarks, Import from Pocket, Screenshot indexing & more!
              </p>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Previous
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button>Finish</Button>
          )}
        </div>
      </div>
    </div>
  )
}
