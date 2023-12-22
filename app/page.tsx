// @ts-nocheck
import { Suspense } from "react"
import { cookies } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import logo from "@/public/logo.svg"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import Search_Bar from "@/app/(search)/searchBar"
import { Search } from "@/app/(search)/searchFunction"
import WelcomeModal from "@/app/onboardModal/welcome-modal"
import { SyncButton } from "@/app/syncButton"

import Loading from "./loadingResults"
import ProfileMenuServer from "./profile-menu-server"
import SearchBar from "./search-bar-client"
import SearchResults from "./searchResults"
import SendAuthExtension from "./send-auth-extension"
import Sidebar from "./sidebar-server"
import UpgradeButton from "./upgrade-button"

interface SearchParams {
  q: string
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerComponentClient({ cookies })
  const sessionPromise = supabase.auth.getSession()
  const userProfilePromise = sessionPromise.then(({ data: { session } }) => {
    if (!session) {
      redirect("/login")
    }

    const { user } = session
    return supabase.from("user_profiles").select("*").eq("id", user.id)
  })

  const [
    {
      data: { session },
    },
    { data: userProfileData, error },
  ] = await Promise.all([sessionPromise, userProfilePromise])

  const access_token = session?.access_token

  if (error) {
    console.error(error)
    return
  }

  let userName, isOnboarded, isSubscribed, userLimit

  if (userProfileData && userProfileData.length > 0) {
    const { user_name, is_onboarded, is_subscribed, user_limit } =
      userProfileData[0]
    userName = user_name
    isOnboarded = is_onboarded
    isSubscribed = is_subscribed
    userLimit = user_limit
  }

  const searchQuery = searchParams?.q || ""
  searchQuery.length > 0 &&
    console.log("[!] Searching for:", searchQuery, new Date())

  return (
    <div key="1" className="min-h-screen w-auto flex bg-green-1">
      <SendAuthExtension access_token={access_token} />
      {!isOnboarded && <WelcomeModal />}
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row-reverse h-14 w-full">
          <ProfileMenuServer />
          <SyncButton />
          {!isSubscribed && <UpgradeButton />}
        </div>
        <div className="flex flex-grow flex-col items-center justify-start p-4 mt-8">
          <div className="flex items-center">
            {/* <Image src={logo} alt="logo" height={45} className="ml-4"></Image> */}
            <h2 className="text-4xl font-bold text-green-12">
              Hey {userName}!
            </h2>
          </div>
          {/*<Search_Bar access_token={access_token} />*/}
          <SearchBar session={session} />
          {searchQuery.length > 0 ? (
            <Suspense fallback={<Loading />}>
              <SearchResults
                searchQuery={searchQuery}
                access_token={access_token}
              />
            </Suspense>
          ) : null}
          {/*<Search_Bar access_token={access_token} />*/}
        </div>
      </div>
    </div>
  )
}
