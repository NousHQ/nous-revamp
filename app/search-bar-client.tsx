"use client"

import Image from "next/image"
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from "@/components/ui/input"
import searchIcon from "@/public/searchIcon.svg"
import { Session } from "@supabase/auth-helpers-nextjs";

export default function SearchBarClient({ session }: { session: Session | null }) {
  useEffect(() => {
    const access_token = session?.access_token;
    if (chrome.runtime !== undefined) {
      const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID;
      chrome.runtime.sendMessage(extensionId, { action: 'getJWT', access_token: access_token }, (response: any) => {
        if (!response) {
          console.log('no extension');
        }
        else {
          console.log(response);
        }
      });
    }
    else {
      console.log('Chrome extension API is not available.');
    }
  }, [session?.access_token]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [query, setQuery] = useState(searchQuery || '');


  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/?q=${query}`);
  }

  return (
    <div className="w-3/4 mx-auto mt-16 flex items-center rounded-full">
      <Image src={searchIcon} alt="search" className="absolute h-6 w-6 mx-3"></Image>
      <form onSubmit={handleSubmit} className="w-full text-greenA-12">
        <Input
          className="bg-greenA-3 hover:bg-greenA-4 pl-10 w-full text-xl font-semibold py-3 rounded-full ring-0 focus:ring-2 focus:ring-green-8 transition-all transform duration-300 ease-in-out"
          placeholder="Search..."
          type="search"
          onChange={e => setQuery(e.target.value)}
          value={query}
        />
      </form>
    </div>
  )
}