import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import ProfileInfo from "@/app/profile/components/Profile-Info"

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const ProfileInfoData = session.user

  return (
    <div className="space-y-10 p-10 divide-y divide-gray-900/10">
      <ProfileInfo user={ProfileInfoData} />
    </div>
  )
}
