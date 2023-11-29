import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const supabase = createRouteHandlerClient({ cookies })

  console.log(formData)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log(error)

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Wrong email or password. Please try again.`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(requestUrl.origin, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}
