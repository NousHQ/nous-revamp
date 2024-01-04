import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import logo from "@/public/logo.png"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OauthButton from "@/components/oauth-button"

import Messages from "./messages"

export default async function Register() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-3">
      <div className="w-96 bg-green-1 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="logo" className="mb-4 h-8 w-8"></Image>
          <h2 className="text-2xl font-semibold text-green-12">
            Create an account
          </h2>
        </div>
        <form className="space-y-6 pt-6" action="/auth/sign-up" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-full px-3 py-2 border border-sage-8 hover:border-sage-9 text-green-12 bg-sage-3"
              id="email"
              placeholder="you@example.com"
              required
              type="email"
              name="email"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              className="w-full px-3 py-2 border border-sage-8 hover:border-sage-9 text-green-12 bg-sage-3"
              id="confirm-password"
              required
              type="password"
              name="confirm-password"
            />
          </div>
          <Button
            className="w-full text-white border-green-8 bg-green-9 hover:bg-green-10 focus:bg-green-5 transition duration-200 py-2 font-bold"
            type="submit"
          >
            Sign up
          </Button>
        </form>
        <div className="relative my-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div>
          <OauthButton />
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          Already have an account?
          <Link className="text-green-11 ml-1 underline" href="/login">
            Login
          </Link>
        </div>
        <Messages />
      </div>
    </div>
  )
}
