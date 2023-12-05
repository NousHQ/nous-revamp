import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import Image from "next/image"
import trash from "@/public/trash.svg"
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

// import { DeleteButton } from "./deleteButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { IndexingContextProvider } from "@/app/indexingContext"
import IndexingDialogue from "@/app/indexingDialogue"

import SavedData from "./sidebar-client"
import { ScrollAreaThumb, Thumb } from "@radix-ui/react-scroll-area"

export default async function Sidebar() {
  const supabase = createServerComponentClient({ cookies })
  // const { data: {session} } = await supabase.auth.getSession();
  // const accessToken = session?.access_token;
  // const apiUrl = process.env.API_URL;

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from("saved_uris")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const job_status = await supabase
    .from("imported_bookmarks")
    .select("is_job_finished")
    .eq("user_id", user?.id)
    .limit(1)

  const isJobFinished = job_status?.data?.[0]?.is_job_finished;

  console.log(job_status)

  async function deleteData(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase
      .from("saved_uris")
      .delete()
      .eq("save_id", id)
      .order("created_at")
      .select()


    
    // revalidatePath("/")

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

  return (
    <>
      <aside className="resize-x w-72 px-4 py-4 border-r bg-green-3 flex flex-col justify-between h-screen">
        <div className="flex flex-col h-full w-full">
          <h2 className="text-base font-bold mb-4 text-green-11">Saved Links</h2>
          <ScrollArea className="flex-grow overflow-auto rounded-md border">
            <SavedData savedData={data ?? []} />
          </ScrollArea>
          <IndexingContextProvider>
            {!isJobFinished && <IndexingDialogue />}
          </IndexingContextProvider>
        </div>
      </aside>
    </>
  )
}
