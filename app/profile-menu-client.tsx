"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import userLogo from "@/public/userLogo.svg"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DiscordIcon } from "@/components/icons"

export default function ProfileMenuClient() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 m-2 rounded-full">
        <Image src={userLogo} alt="user-img"></Image>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 mt-2">
        {/* <Link href={`/profile`}>
          <DropdownMenuItem className="cursor-pointer">
            Profile
          </DropdownMenuItem>
        </Link> */}
        <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
          Sign out
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"https://discord.gg/42tuRTN2eA"} className="text-sm">
            <div className="flex justify-between items-center bg-greenA-4 hover:bg-greenA-6 px-4 py-0.5 rounded-xl mt-2">
              <DiscordIcon className="w-4 h-4 mr-2 fill-emerald-800" />
              Join our discord
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
