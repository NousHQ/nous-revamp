import { Session } from "@supabase/auth-helpers-nextjs";
import ProfileMenuClient from "./profile-menu-client";

export default function ProfileMenuServer() {
  return <ProfileMenuClient />; 
}