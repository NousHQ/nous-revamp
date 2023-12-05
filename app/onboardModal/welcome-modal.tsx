"use client"

import React, { Fragment, useState } from "react"
import { Transition } from "@headlessui/react"

import { WelcomeModalCard } from "@/app/onboardModal/welcome-modal-card"
import ImportCard from "@/app/onboardModal/import-card"
import NameCard from "@/app/onboardModal/name-card"

export default function WelcomeModal() {
  const [open, setOpen] = useState(true)
  const [cardNumber, setCardNumber] = useState(1)
  const [prevButtonState, setPrevButtonState] = useState(true)
  const [nextButtonState, setNextButtonState] = useState(true)

  const [name, setName] = useState('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    console.log(name)
  }

  const finishOnboarding = async () => {
    console.log("Sent name: " + name)
    // supabase send name
    // supabase update onboarding to false
    // supabase send bookmarks
  };
  
  const handleNext = () => {
    if (cardNumber < 4) { // Assuming you have 3 cards
      setCardNumber(prevCardNumber => prevCardNumber + 1);
      setPrevButtonState(true);
    if (cardNumber === 3) {
      finishOnboarding();
      console.log("Finished onboarding")
      setOpen(false);
    }
    }
  }
  const handlePrev = () => {
    console.log(cardNumber)
    if (cardNumber > 1) {
      setCardNumber(prevCardNumber => prevCardNumber - 1);
      setNextButtonState(true);
      if (cardNumber === 2) {
        setPrevButtonState(false);
      }
    }
  };
  const renderCard = () => {
    switch (cardNumber) {
      case 1:
        return (
          <div>
            <h3 className="text-green-700 text-lg font-semibold text-center">
              Import your bookmarks
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              We support importing from Chrome, Firefox, Safari, and Edge.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <ImportCard />
          </div>
        );
      case 3:
        return (
          <div>
            <NameCard handleNameChange={handleNameChange} />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center space-y-2">
          <h3 className="text-green-700 text-lg font-semibold text-center">
            Here's how it works
          </h3>
          <iframe
            className="rounded-xl w-full h-80"
            src="https://www.youtube.com/embed/ygi7otUz18U"
            title="Nous: A search engine for bookmarks."
            allow="autoplay; encrypted-media;"
          ></iframe>
        </div>
        );
      // Add more cases as needed...
      default:
        return null;
    }
  }

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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <WelcomeModalCard
            prevButtonState={prevButtonState}
            nextButtonState={nextButtonState}
            cardNumber={cardNumber}
            handleNext={handleNext}
            handlePrev={handlePrev}
          >
            {renderCard()}
          </WelcomeModalCard>
        </div>
      </Transition.Child>
    </Transition>
  )
}
