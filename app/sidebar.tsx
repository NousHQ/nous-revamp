import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import trash from "@/public/trash.svg"
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
// import { DeleteButton } from "./deleteButton";
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function Sidebar() {
  const supabase = createServerComponentClient({ cookies });
  // const { data: {session} } = await supabase.auth.getSession();
  // const accessToken = session?.access_token;
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    <aside className="resize-x w-72 p-4 border-r bg-primary dark:bg-zinc-800/40 dark:border-zinc-700 flex flex-col justify-between h-screen">
      <div className="flex flex-col h-full">
        <h2 className="text-base font-bold mb-4 text-white">Saved Links</h2>
        <ScrollArea className="rounded-md border flex-grow overflow-auto">
          {data && data.length > 0 ? (
            data.map((item: any) => (
              <nav className="grid items-start" key={item.save_id}>
                <div className="text-xs flex justify-between items-center w-full my-2">
                  <a className="w-full py-2 relative rounded-lg transition-all duration-300 flex items-end justify-start gap-3 font-medium text-[#F9F9FB] hover:bg-[#70A771]/30" href={item.url} target="_blank">
                    <span className="ml-1 text-ellipsis max-h-4 overflow-hidden break-all relative">
                      {item.title}
                    </span>
                  </a>
                  <form action={deleteData}>
                    <input type="hidden" name="id" value={item.save_id}/>
                    {/* <DeleteButton/> */}
                    <button type="submit">
                      <Image src={trash} alt="Delete" className="opacity-30 hover:opacity-75 mr-4 cursor-pointer"/>
                    </button>
                  </form>
                </div>
              </nav>
            ))
          ) : (
            <div>Bookmark using the extension!</div>
          )}
        </ScrollArea>
      </div>
    </aside>
)}

