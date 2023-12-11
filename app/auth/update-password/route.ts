import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const password = String(formData.get("password"))
  const supabase = createRouteHandlerClient({ cookies })

  console.log(formData)

  const { error } = await supabase.auth.updateUser({ password: password });
  console.log(error)

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/update-password?error=${error}`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/?ext`,
    {
      status: 301,
    }
  )
}
