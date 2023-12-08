"use client"

import { useEffect} from "react"
import { createClientComponentClient, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import trash from "@/public/trash.svg"
import { deleteData } from "./actions";
import { useRouter } from "next/navigation";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

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
  }, [router, supabase])

  return (
    <div>
    {savedData && savedData.length > 0 ? (
      savedData.map((item: any) => (
        
      // <nav className="grid items-start" key={item.save_id}>
        <ContextMenu key={item.save_id}>
          <ContextMenuTrigger>
            <div className="text-xs flex justify-between items-center w-full pr-4">
              <a className="w-full py-3 relative rounded-lg flex items-end justify-start gap-3 font-medium text-green-12 hover:bg-green-3" href={item.url} target="_blank">
                <span className="ml-1 text-ellipsis max-h-4 overflow-hidden break-all relative">
                  {item.title}
                </span>
              </a>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-green-1">
            <ContextMenuItem>
              <form action={deleteData} className="w-full" >
                <input type="hidden" name="id" value={item.save_id}/>
                <button type="submit" className="flex items-center justify-center text-xs text-green-12 bg-green-1 gap-3 rounded-lg w-full">
                  <Image src={trash} alt="Delete" className="text-green-12 h-3 w-3"/>
                  Delete
                </button>
              </form>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        // </nav>
      ))
    ) : (
      <div>Bookmark using the extension!</div>
    )
  }
  </div>
)}
