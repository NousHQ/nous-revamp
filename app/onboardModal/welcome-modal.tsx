"use client"

import React, { Fragment, useEffect, useState } from "react"
import Link from "next/link"
import { Transition } from "@headlessui/react"
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import ImportCard from "@/app/onboardModal/import-card"
import NameCard from "@/app/onboardModal/name-card"
import { WelcomeModalCard } from "@/app/onboardModal/welcome-modal-card"

type ImportCardProps = {
  user: User | null
}

type ParsedLink = {
  id: string
  name: string
  url: string
  checked: boolean
}

type ParsedFolder = {
  id: string
  name: string
  checked: boolean
  links: (ParsedLink | ParsedFolder)[]
  open: boolean
}

// type BookmarkNodeProps = {
//   node: ParsedLink | ParsedFolder
// }

interface WelcomeModalProps {
  user: User | null
  maxCheckedCount: number | null
}

export default function WelcomeModal({
  user,
  maxCheckedCount,
}: WelcomeModalProps) {
  const supabase = createClientComponentClient()
  const [open, setOpen] = useState(true)
  const [cardNumber, setCardNumber] = useState(1)
  const [prevButtonState, setPrevButtonState] = useState(true)
  const [nextButtonState, setNextButtonState] = useState(true)
  const [name, setName] = useState("")

  const [userLimit, setUserLimit] = useState<number | null>(null)
  const [bookmarkTree, setBookmarkTree] = useState<ParsedFolder[]>([])
  const [checkedCount, setCheckedCount] = useState(0)
  const [fireToast, setFireToast] = useState(false)
  const [isChromeRuntime, setIsChromeRuntime] = useState(false)

  useEffect(() => {
    setIsChromeRuntime(
      typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined"
    )
    setNextButtonState(false)

  }, [])

  const { toast } = useToast()

  // First useEffect for handling the toast
  useEffect(() => {
    if (fireToast) {
      toast({
        title: "Want more? Get PRO!",
        description: "You can have upto 1000 bookmarks with the PRO version",
        action: (
          <ToastAction className="bg-green-9 text-green-1" altText="Get Pro.">
            <Link
              href={`https://nous.lemonsqueezy.com/checkout/buy/82a52c59-48db-430d-84de-122206ef2002?checkout[custom][user_id]=${user?.id}&checkout[email]=${user?.email}`}
            >
              Upgrade Now!
            </Link>
          </ToastAction>
        ),
        className: "bg-green-5 border-green-8 text-sage-11",
      })
      setFireToast(false)
    }
  }, [fireToast, toast])

  useEffect(() => {
    setUserLimit(maxCheckedCount)
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    console.log(name)
  }

  async function handleSubmitBookmarks(): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const extractCheckedNodes = (
      node: ParsedLink | ParsedFolder
    ): ParsedLink | ParsedFolder | null => {
      if ("url" in node) {
        // It's a link
        return node.checked ? node : null
      } else {
        // It's a folder
        const checkedChildren = node.links
          .map((child) => extractCheckedNodes(child))
          .filter(Boolean) as (ParsedLink | ParsedFolder)[]

        if (node.checked || checkedChildren.length > 0) {
          return {
            ...node,
            links: checkedChildren,
          }
        }
        return null
      }
    }
    const checkedNodes = bookmarkTree
      .map((node) => extractCheckedNodes(node))
      .filter(Boolean) as ParsedFolder[]
    console.log(checkedNodes)

    console.log(session?.access_token)
    const { data, error } = await supabase
      .from("imported_bookmarks")
      .insert({
        bookmarks: checkedNodes,
        user_id: user?.id,
        num_imported: checkedCount,
        is_job_finished: false,
      })
      .select()

    if (error) {
      console.error(error)
    } else {
      console.log(data)
    }
  }

  const finishOnboarding = async () => {
    console.log("Sent name: " + name)
    await supabase
      .from("user_profiles")
      .update({ user_name: name })
      .eq("id", user?.id)
    await supabase
      .from("user_profiles")
      .update({ is_onboarded: true })
      .eq("id", user?.id)
  }

  const handleNext = () => {
    if (cardNumber < 4) {
      // Assuming you have 3 cards
      setCardNumber((prevCardNumber) => prevCardNumber + 1)
      setPrevButtonState(true)
      if (cardNumber === 2) {
        handleSubmitBookmarks()
      }
      if (cardNumber === 3) {
        finishOnboarding()
        console.log("Finished onboarding")
        setOpen(false)
      }
    }
  }
  const handlePrev = () => {
    console.log(cardNumber)
    if (cardNumber > 1) {
      setCardNumber((prevCardNumber) => prevCardNumber - 1)
      setNextButtonState(true)
      if (cardNumber === 2) {
        setPrevButtonState(false)
      }
    }
  }
  const renderCard = () => {
    switch (cardNumber) {
      // case 1:
      //   return (
      //     <div className="w-full h-full border">
      //       <h3 className="text-green-700 text-lg font-semibold text-center">
      //         Import your bookmarks
      //       </h3>
      //       <p className="text-gray-500 dark:text-gray-400 text-center">
      //         We support importing from Chrome, Firefox, Safari, and Edge.
      //       </p>
      //     </div>
      //   )
      case 1:
        return (
          <div className="flex flex-grid items-center w-full">
            {isChromeRuntime ? (
              <NameCard handleNameChange={handleNameChange} />
            ) : (
              <a
                className="text-green-11 text-base font-semibold text-center underline flex flex-col items-center justify-center gap-4 w-full"
                href="https://chromewebstore.google.com/detail/nous/kdnfbangdkkddhgamelpdcgfmaecicel"
              >
                Download the Chrome Extension to proceed further!
              </a>
            )}
          </div>
        )
      case 2:
        return (
          <div className="flex flex-col items-center spacy-y-2">
            <h3 className="text-green-12 text-lg font-semibold text-center">
              Import your bookmarks
            </h3>
            <p className="text-green-11 text-base font-semibold text-center underline">
              Nous will import and index all your Chrome bookmarks.
            </p>
            <ImportCard
              user={user}
              name={name}
              setName={setName}
              bookmarkTree={bookmarkTree}
              setBookmarkTree={setBookmarkTree}
              checkedCount={checkedCount}
              setCheckedCount={setCheckedCount}
              maxCheckedCount={userLimit}
              fireToast={fireToast}
              setFireToast={setFireToast}
              toast={toast}
            />{" "}
          </div>
        )
      case 3:
        return (
          <div className="flex flex-col items-center space-y-6 w-3/4">
            <h3 className="text-green-12 text-lg font-semibold text-center">
              Your bookmarks are being imported. Meanwhile, watch this demo to
              see how it works
            </h3>
            <iframe
              className="rounded-xl w-full h-full"
              src="https://www.youtube.com/embed/zDqDLFW1pJ0"
              title="Nous: A search engine for bookmarks."
              allow="autoplay; encrypted-media;"
            ></iframe>
          </div>
        )
      default:
        return null
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
