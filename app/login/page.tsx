import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import logo from "@/public/logo.png"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import jwt, { Secret } from "jsonwebtoken"

// Import the Secret type from the jsonwebtoken package

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import OauthButton from "@/components/oauth-button"

import Messages from "./messages"

export default async function Login() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const access_token = session?.access_token
  if (session && access_token) {
    try {
      const secret = process.env.SUPABASE_JWT_SECRET
      jwt.verify(access_token, secret as Secret) // Cast secret as Secret type
      redirect("/")
    } catch (err) {
      console.error("Invalid token")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-3">
      <div className="w-96 bg-green-1 rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="logo" className="mb-4 h-8 w-8"></Image>
          <h2 className="text-2xl font-semibold text-green-12">Login</h2>
        </div>
        <form className="space-y-6 pt-6" action="/auth/sign-in" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-full px-3 py-2 border border-sage-8 hover:border-sage-9 text-green-12 bg-sage-3"
              id="email"
              placeholder="bill@gates.com"
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
          <Button
            className="w-full text-white border-green-8 bg-green-9 hover:bg-green-10 focus:bg-green-5 transition duration-200 py-2 font-bold"
            type="submit"
          >
            Sign in
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
            <span className="px-2 bg-green-1 text-sage-11">Or</span>
          </div>
        </div>
        <OauthButton />
        <div className="text-center mt-4 text-sm text-gray-500">
          Don&apos;t have an account?
          <Link className="text-green-11 ml-1 underline" href="/register">
            Register
          </Link>
          <br />
          Forgot your password
          <Link className="text-green-11 ml-1 underline" href="/reset-password">
            Reset password
          </Link>
        </div>
        <Messages />
      </div>
    </div>
  )
}
