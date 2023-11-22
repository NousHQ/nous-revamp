"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteData(formData: FormData) {
    const id = formData.get('id') as string;
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase
      .from("all_saved")
      .delete()
      .eq("save_id", id)
      .order("created_at", )
      .select()

    revalidatePath('/')

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
