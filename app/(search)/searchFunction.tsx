// Dependencies
import Link from "next/link"

const apiUrl = process.env.API_URL

export async function Search(
  searchQuery: string | undefined,
  access_token: string | undefined
) {
  try {
    const response = await fetch(
      `https://api.nous.fyi/api/search?query=${searchQuery}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
    return await response.json()
  } catch (err) {
    console.error(err)
  }
}
