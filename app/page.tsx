// @ts-nocheck
import { Suspense } from "react"
import { cookies } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"
import logo from "@/public/logo.svg"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import Search_Bar from "@/app/(search)/searchBar"
import WelcomeModal from "@/app/onboardModal/welcome-modal"
import { SyncButton } from "@/app/syncButton"

import ProfileMenuServer from "./profile-menu-server"
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
  let id,
    user_name,
    email_id,
    profile_picture,
    is_onboarded,
    is_subscribed,
    user_limit
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const user = session.user
  const userProfileResponse = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)

  const access_token = session?.access_token
  if (userProfileResponse.data && userProfileResponse.data.length > 0) {
    const userProfile = userProfileResponse.data[0]
    id = userProfile.id
    user_name = userProfile.user_name
    email_id = userProfile.email_id
    profile_picture = userProfile.profile_picture
    is_onboarded = userProfile.is_onboarded
    is_subscribed = userProfile.is_subscribed
    user_limit = userProfile.user_limit
  }
  const { count } = await supabase
    .from("saved_uris")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id)

  const maxCheckedCount = user_limit - (count ?? 0)

  const searchQuery = searchParams?.q || ""

  return (
    <div key="1" className="min-h-screen w-auto flex bg-green-1">
      <SendAuthExtension access_token={access_token} />
      {!is_onboarded && <WelcomeModal user={user} maxCheckedCount={maxCheckedCount} />}
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row-reverse h-14 w-full">
          <ProfileMenuServer />
          <SyncButton maxCheckedCount={maxCheckedCount} />
          {!is_subscribed && <UpgradeButton />}
        </div>
        <div className="flex flex-grow flex-col items-center justify-start p-4 mt-8">
          <div className="flex items-center">
            {/* <Image src={logo} alt="logo" height={45} className="ml-4"></Image> */}
            <h2 className="text-4xl font-bold text-green-12">
              Hey {user_name}!
            </h2>
          </div>
          <Search_Bar access_token={access_token} />
        </div>
      </div>

      {/*<div className="flex flex-grow">*/}
      {/*  <SendAuthExtension access_token={access_token} />*/}
      {/*  <ProfileMenuServer />*/}
      {/*  {!isSubscribed && <UpgradeButton />}*/}
      {/*  <Sidebar />*/}
      {/*  {!isOnboarded && <WelcomeModal />}*/}
      {/*  <div className="flex flex-grow flex-col items-center justify-start p-4 mt-8">*/}
      {/*    <div className="flex items-center">*/}
      {/*      /!* <Image src={logo} alt="logo" height={45} className="ml-4"></Image> *!/*/}
      {/*      <h2 className="text-4xl font-bold text-green-12">*/}
      {/*        Hey {userName}!*/}
      {/*      </h2>*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col">*/}
      {/*      <SearchBar session={session} />*/}
      {/*      {searchQuery.length > 0 ? (*/}
      {/*        <Suspense fallback={<Loading />}>*/}
      {/*          <SearchResults*/}
      {/*            searchQuery={searchQuery}*/}
      {/*            access_token={access_token}*/}
      {/*          />*/}
      {/*        </Suspense>*/}
      {/*      ) : null}*/}
      {/*      /!*<Search_Bar access_token={access_token} />*!/*/}
      {/*    </div>*/}

      {/*    /!* {searchQuery.length > 0 ? (*/}
      {/*      <SearchResults*/}
      {/*        searchQuery={searchQuery}*/}
      {/*        access_token={access_token}*/}
      {/*      />*/}
      {/*    ) : null} *!/*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
