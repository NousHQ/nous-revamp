// @ts-nocheck
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import jwt from "jsonwebtoken"

import Search_Bar from "@/app/(search)/searchBar"
import { Header } from "@/app/header"
import WelcomeModal from "@/app/onboardModal/welcome-modal"

import SendAuthExtension from "./send-auth-extension"

export default async function Home() {
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

  const access_token = session?.access_token
  if (access_token) {
    const secret = process.env.SUPABASE_JWT_SECRET
    jwt.verify(access_token, secret, function (err) {
      if (err) {
        redirect("/login")
      }
    })
  }

  const user = session?.user

  // if (!user || user.iat <= 1703681014) {
  //   redirect("/login")
  // }

  const userProfileResponse = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)

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

  const { data: bookmarks, error } = await supabase
    .from("saved_uris")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div key="1" className="w-auto flex bg-green-1">
      <SendAuthExtension user={user} access_token={access_token} />
      {!is_onboarded && (
        <WelcomeModal user={user} maxCheckedCount={maxCheckedCount} />
      )}

      <div className="relative flex flex-col flex-grow">
        <Header
          maxCheckedCount={maxCheckedCount}
          is_subscribed={is_subscribed}
        />
        <div className="flex flex-col items-center p-4 mt-8">
          <div className="flex items-center">
            <h2 className="text-4xl font-bold text-green-12">
              Hey {user_name}!
            </h2>
          </div>
          <Search_Bar access_token={access_token} bookmarks={bookmarks} />
        </div>
      </div>
    </div>
  )
}
