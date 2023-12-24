"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

export async function deleteData(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = createServerActionClient({ cookies })

  const { data, error } = await supabase
    .from("saved_uris")
    .delete()
    .eq("id", id)
    .order("created_at")
    .select()

  revalidatePath("/")

  if (error) {
    console.log(error)
  }
  console.log(data)

  //   "use server";
  //   const id = formData.get('id')
  //   const response = await fetch(`${apiUrl}/api/delete/${id}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`
  //     }
  //   })
  //   if (response.status === 200) {
  //     revalidatePath('/')
  //   }
}

export async function getBookmarks() {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("saved_uris")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return data
}
