import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const confirmPassword = String(formData.get('confirm-password'))
  const supabase = createRouteHandlerClient({ cookies })

  console.log(formData)
  if (password !== confirmPassword) {
    console.log('Passwords do not match')
    return NextResponse.redirect(
        `${requestUrl.origin}/register?error=Passwords do not match`,
        {
            status: 301,
        }
    )
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },

  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/register?error=Could not sign up user`,
      {
        status: 301,
      }
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/register?success=Successfully signed up!`,
    {
      status: 301,
    }
  )
}