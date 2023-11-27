import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import logo from '@/public/logo.png'

import Messages from './messages'

export default async function Login() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session }} = await supabase.auth.getSession()
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center text-black">
      <div className="w-96 bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="logo" className="mb-4 h-8 w-8"></Image>
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
        </div>
        <form
          className="space-y-6 pt-6"
          action="/auth/sign-in"
          method="post"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
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
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
              id="password"
              required
              type="password"
              name="password"
            />
          </div>
          <Button
            className="w-full text-white bg-green-400 hover:bg-green-500 transition duration-200 rounded-md py-2 font-bold"
            type="submit"
          >
            Sign in
          </Button>
        </form>
        <div className="relative my-6">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <div>
          <Button className="w-full text-gray-600 border-gray-300 bg-gray-100" variant="outline">
          <Image
            src={'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png'}
            alt='google logo'
            width={20}
            height={20}
            className="mr-3"
          />
          <span>Sign in with Google</span>
          </Button>
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          Don&apos;t have an account?
          <Link className="text-green-400 ml-1 underline" href="/register">
            Register
          </Link>
        </div>
        <Messages />
      </div>
    </div>
  )
}
