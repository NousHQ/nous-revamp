import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getURL } from "@/utils/helpers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const supabase = createRouteHandlerClient({ cookies })

  console.log(formData)

  const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
    // redirectTo: 'http://localhost:3000/auth/callback?next=/update-password/',
    redirectTo: `${getURL()}/auth/callback?next=/update-password/`,
  })
  
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/reset-password?error=Error`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/reset-password?success=Check your email`,
    {
      status: 301,
    }
  )
}