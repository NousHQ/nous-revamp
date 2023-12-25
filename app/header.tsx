import Image from "next/image"
import logo from "@/public/logo.svg"

import ProfileMenuServer from "@/app/profile-menu-server"
import { SyncButton } from "@/app/syncButton"
import UpgradeButton from "@/app/upgrade-button"

export function Header({
  maxCheckedCount,
  is_subscribed,
}: {
  maxCheckedCount: number
  is_subscribed: boolean
}) {
  return (
    <div className="flex">
      {/* <div className="flex items-center select-none">
        <Image src={logo} alt="logo" height={45} className="ml-4 mr-2" />
        <h2 className="text-3xl font-bold text-green-12">Nous</h2>
      </div> */}
      <div className="flex flex-row-reverse h-14 w-full">
        <ProfileMenuServer />
        <SyncButton maxCheckedCount={maxCheckedCount} />
        {!is_subscribed && <UpgradeButton />}
      </div>
    </div>
  )
}
