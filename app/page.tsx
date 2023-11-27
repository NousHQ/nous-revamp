import { Suspense } from "react"
import Image from "next/image"
import logo from "@/public/logo.svg"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import ProfileMenuServer from "./profile-menu-server"
import SearchBarServer from "./search-bar-server"
import Sidebar from "./sidebar-server"
import SearchResults from "./searchResults"
import Loading from "./loadingResults"
import { SyncButton } from "./syncButton"

interface SearchParams {
  q: string;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const apiUrl = process.env.API_URL;
  const supabase = createServerComponentClient({ cookies })
  const { data: { session }} = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const { user } = session;
  const searchQuery = searchParams.q;

  return (
    <div key="1" className="h-screen flex flex-col justify-center dark:bg-zinc-900">
      <div className="flex flex-grow">
        <ProfileMenuServer />
        <SyncButton />
        <Sidebar/>
        <div className="flex flex-grow flex-col items-center justify-start p-4 transition-all transform duration-500 ease-in-out mt-16">
          <div className="flex items-center">
            <Image src={logo} alt="logo" height={45} className="ml-4"></Image>
            <h2 className="text-4xl font-bold ml-4 dark:text-zinc-50">Hey {user.email}!</h2>
          </div>
          <SearchBarServer />
          {searchQuery ?
          <Suspense fallback={<Loading />} key={searchQuery} >
            <SearchResults searchQuery={searchQuery} />
          </Suspense>
          :
          null}
          </div>
      </div>
    </div>
  )
}
