import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SearchBarClient from "./search-bar-client";

export default async function SearchBarServer() {
  const supabase = createServerComponentClient({ cookies });
  const { data: {session} } = await supabase.auth.getSession();
  return <SearchBarClient session={session} />; 
}