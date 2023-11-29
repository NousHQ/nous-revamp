import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import ProfileInfo from "@/app/profile/components/Profile-Info"

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const {
    data,
  } = await supabase.from("user_profiles").select("*").eq("id", user?.id).limit(1) 
  
  return (
    <div className="space-y-10 p-10 divide-y divide-gray-900/10">
      {data && <ProfileInfo user={data[0]} />}
    </div>
  )
}
