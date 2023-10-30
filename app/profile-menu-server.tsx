import { Session } from "@supabase/auth-helpers-nextjs";
import ProfileMenuClient from "./profile-menu-client";

export default async function ProfileMenuServer() {
  return <ProfileMenuClient />; 
}