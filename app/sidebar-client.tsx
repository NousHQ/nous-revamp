"use client"

import { useEffect} from "react"
import { createClientComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
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
          <div className="text-xs flex justify-between items-center w-full my-1 pr-4">
            <a className="w-full mr-2 py-3.5 relative rounded-lg transition-all duration-300 flex items-end justify-start gap-3 font-medium text-[#F9F9FB] hover:bg-[#70A771]/30" href={item.url} target="_blank">
              <span className="ml-1 text-ellipsis max-h-4 overflow-hidden break-all relative">
                {item.title}
              </span>
            </a>
            <form action={deleteData}>
              <input type="hidden" name="id" value={item.save_id}/>
              {/* <DeleteButton/> */}
              <button type="submit" className="px-2 py-3.5 group hover:bg-[#70A771]/30 rounded-lg">
                <Image src={trash} alt="Delete" className="w-6 opacity-30 group-hover:opacity-75 cursor-pointer"/>
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
