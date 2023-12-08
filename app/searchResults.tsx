import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

interface SearchProps {
  searchQuery: string
  access_token: string | undefined
}

interface SearchResult {
  id: string
  index: number
  title: string
  uri: string
}

export default async function SearchResults({
  searchQuery,
  access_token,
}: SearchProps) {
  // const supabase = createServerComponentClient({ cookies })

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()
  // const accessToken = session?.access_token
  console.log(searchQuery)
  const apiUrl = process.env.API_URL

  let results
  try {
    const response = await fetch(`${apiUrl}/api/search?query=${searchQuery}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    const data = await response.json()
    if (data && data.results && data.results.length > 0) {
      results = data.results
    } else {
      return (
        <div className="bg-green-3 my-4 text-green-12 rounded-lg shadow-lg p-4 mb-2">
          <h3 className="text-md font-medium dark:text-zinc-50">
            No results found :/{" "}
          </h3>
        </div>
      )
    }
  } catch (err) {
    console.error(err)
    return (
      <div className="bg-red-200 mt-4 rounded-lg shadow-md p-4 mb-2">
        <h3 className="text-md font-medium dark:text-zinc-50">
          Something failed :/{" "}
        </h3>
        <Link className="text-green-12 underline" href="https://x.com/sidbing">
          Tweet at me to let me know!
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 overflow-y-auto h-1/2">
      {results.map((item: SearchResult) => (
        <Link href={item.uri} key={item.id} target="_blank">
          <div className="bg-green-3 hover:bg-green-4 focus:bg-green-5 text-green-12 rounded-lg shadow-lg p-4 mb-2">
            <h3 className="text-md font-medium dark:text-zinc-50">
              {item.title}
            </h3>
            <p className="text-sage-11 text-sm">{item.uri}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
