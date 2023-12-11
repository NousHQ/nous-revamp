'use client'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getURL } from "@/utils/helpers";

export default async function OauthButton() {
  const supabase = createClientComponentClient();
  
  async function oauthLogin() {
    console.log("oauthLogin");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }
  return (
    <div>
      <Button
        className="w-full text-green-12 border-sage-8 bg-sage-3 hover:bg-sage-4 focus:bg-sage-5 transition duration-200 py-2 font-semibold"
        variant="outline"
        onClick={oauthLogin}
      >
        <Image
          src={
            "https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
          }
          alt="google logo"
          width={20}
          height={20}
          className="mr-3"
        />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
