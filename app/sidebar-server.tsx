import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import trash from "@/public/trash.svg"
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
// import { DeleteButton } from "./deleteButton";
import { ScrollArea } from "@/components/ui/scroll-area"
import SavedData from "./sidebar-client";
import IndexingDialogue from "@/app/indexingDialogue";
import { IndexingContextProvider } from "@/app/indexingContext";

export default async function Sidebar() {
  const supabase = createServerComponentClient({ cookies });
  // const { data: {session} } = await supabase.auth.getSession();
  // const accessToken = session?.access_token;
  // const apiUrl = process.env.API_URL;

  const { data: { user } } = await supabase.auth.getUser()
  const {data, error} = await supabase.from("all_saved").select("*").eq("user_id", user?.id).order("created_at", {ascending: false})


  async function deleteData(formData: FormData) {
    "use server"
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

  return(
    <aside className="resize-x w-72 pl-4 py-4 border-r bg-primary dark:bg-zinc-800/40 dark:border-zinc-700 flex flex-col justify-between h-screen">
      <div className="flex flex-col h-full">
        <h2 className="text-base font-bold mb-4 text-white">Saved Links</h2>
        <ScrollArea className="flex-grow overflow-auto">
          <SavedData savedData={data ?? []}/>
        </ScrollArea>
        <IndexingContextProvider>
            <IndexingDialogue/>
        </IndexingContextProvider>
      </div>
    </aside>
)}

