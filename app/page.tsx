import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Login from "@/components/login";
import DashBoard from "@/components/dashboard";
import Landing from "@/components/Landing";

export default function Index() {
    return <>
        <Landing/>
    </>
}
