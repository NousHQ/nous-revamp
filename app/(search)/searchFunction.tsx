// Dependencies
import Link from "next/link"

export async function Search(
  searchQuery: string | undefined,
  access_token: string | undefined
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  try {
    const response = await fetch(`${apiUrl}/api/search?query=${searchQuery}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    return await response.json()
  } catch (err) {
    console.error(err)
  }
}
