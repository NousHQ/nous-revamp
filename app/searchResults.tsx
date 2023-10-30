import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

interface SearchProps {
  searchQuery: string;
}

interface SearchResult {
  id: string,
  index: number,
  title: string;
  uri: string;
}


export default async function SearchResults({ searchQuery }: SearchProps) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session }} = await supabase.auth.getSession()
  const accessToken = session?.access_token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/search?query=${searchQuery}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  const data = await response.json()

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 overflow-y-auto h-96">
      {data.results.map((item: SearchResult) => (
        <Link href={item.uri} key={item.id}>
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 mb-2">
            <h3 className="text-md font-medium dark:text-zinc-50">{item.title}</h3>
            <p className="text-zinc-500 text-sm dark:text-zinc-400">{item.uri}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}