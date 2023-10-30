"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import Image from "next/image"
import userLogo from "@/public/userLogo.svg"

export default function ProfileMenuClient(){
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
    <DropdownMenuContent>
      <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}