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

export default function ProfileMenuClient() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="fixed p-1 m-2 top-2 right-4 rounded-full">
        <Image src={userLogo} alt="user-img"></Image>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 mt-2">
        <Link href={`/profile`}>
          <DropdownMenuItem className="cursor-pointer">
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
