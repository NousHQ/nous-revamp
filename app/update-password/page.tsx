import Image from "next/image"
import logo from "@/public/logo.png"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Messages from "./messages"

export default async function PasswordResetForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-3">
      <div className="w-96 bg-green-1 rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="logo" className="mb-4 h-8 w-8"></Image>
          <h2 className="text-2xl font-semibold text-green-12">
            Reset your password
          </h2>
        </div>
        <form
          className="space-y-6 pt-6"
          action="/auth/update-password"
          method="post"
        >
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className="w-full px-3 py-2 border border-sage-8 hover:border-sage-9 text-green-12 bg-sage-3"
              id="password"
              required
              type="password"
              name="password"
            />
          </div>
          <Button
            className="w-full text-white border-green-8 bg-green-9 hover:bg-green-10 focus:bg-green-5 transition duration-200 py-2 font-bold"
            type="submit"
          >
            Update Password
          </Button>
        </form>
        <div className="relative my-6"></div>
        <Messages />
      </div>
    </div>
  )
}
