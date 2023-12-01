"use client"

import React, { Fragment, useState } from "react"
import { Transition } from "@headlessui/react"

import { WelcomeModalCard } from "@/components/welcome-modal-card"

export default function WelcomeModal() {
  const [open, setOpen] = useState(true)
  const [cardNumber, setCardNumber] = useState(1)
  const [prevButtonState, setPrevButtonState] = useState(false)
  const [nextButtonState, setNextButtonState] = useState(false)
  return (
    <Transition show={open}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <WelcomeModalCard
            prevButtonState={prevButtonState}
            nextButtonState={nextButtonState}
            cardNumber={cardNumber}
          >
            <div>
              <h3 className="text-green-700 text-lg font-semibold text-center">
                Import your bookmarks
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                We support importing from Chrome, Firefox, Safari, and Edge.
              </p>
            </div>
          </WelcomeModalCard>
        </div>
      </Transition.Child>
    </Transition>
  )
}
