import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import trash from "@/public/trash.svg"
import Image from "next/image";
import { revalidatePath } from "next/cache";
// import { DeleteButton } from "./deleteButton";

export default async function Sidebar() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/all_saved`, {
    next: { revalidate: 300 },
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      }
  })

  const data = await response.json()

  async function deleteData(formData: FormData) {
    "use server";
    const id = formData.get('id')
    const response = await fetch(`${apiUrl}/api/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    if (response.status === 200) {
      revalidatePath('/')
    }

  }

  return(
    <aside className="resize-x w-72 p-4 border-r bg-primary dark:bg-zinc-800/40 dark:border-zinc-700 flex flex-col justify-between">
    <div>
    <h2 className="text-base font-bold mb-4 text-white">Saved Links</h2>
    {data.map((item: any) => (
      <nav className="grid items-start" key={item.id}>
          <div className="text-xs flex justify-between items-center w-full my-2">
            <a className="w-full py-2 relative rounded-lg transition-all duration-300 flex items-end justify-start gap-3 font-medium text-[#F9F9FB] hover:bg-[#70A771]/30" href={item.uri} target="_blank">
                <span className="ml-1 text-ellipsis max-h-4 overflow-hidden break-all relative">
                  {item.title}
                </span>
            </a>
            <form action={deleteData}>
              <input type="hidden" name="id" value={item.id}/>
              {/* <DeleteButton/> */}
              <button type="submit">
                <Image src={trash} alt="Delete" className="opacity-30 hover:opacity-75 ml-3 cursor-pointer"/>
              </button>
            </form>
          </div>
        </nav>
    ))}
    
    </div>
    </aside>
)}