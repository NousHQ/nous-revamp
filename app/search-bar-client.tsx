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
    <div className="w-full mx-auto max-w-3xl mt-16 flex items-center bg-white dark:bg-zinc-800 rounded-full shadow-md">
      <Image src={searchIcon} alt="search" className="absolute h-5 w-5 ml-3"></Image>
      <form onSubmit={handleSubmit} className="w-full">
      <Input
        className="pl-10 bg-white hover:bg-gray-100 w-full text-lg py-3 rounded-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50 transition-all duration-200 ease-in-out"
        placeholder="Search..."
        type="search"
        onChange={e => setQuery(e.target.value)}
        value={query}
      />
      </form>
    </div>
  )
}