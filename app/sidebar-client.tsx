"use client"

import { useEffect } from "react"
import { createClientComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { revalidatePath } from "next/cache";
import Image from "next/image";
import trash from "@/public/trash.svg"
import { deleteData } from "./actions";
import { useRouter } from "next/navigation";

export default function SavedData({ savedData }: { savedData: any }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  useEffect(() => {
    const channel = supabase
    .channel('realtime saved')
    .on('postgres_changes', {
        event: "*",
        schema: "public"
      },
      // (payload) => {console.log(payload)}
      () => {router.refresh()}
    )
    .subscribe()
  }, [])

  return (
    <div>
    {savedData && savedData.length > 0 ? (
      savedData.map((item: any) => (
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
    )
  }
  </div>
)}