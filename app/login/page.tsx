import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers"
import Login from "@/components/login2"
import DashBoard from "@/components/dashboard";
export default async function LoginPage({searchParams}){
    const supabase = createServerComponentClient({ cookies });
    const user = await supabase.auth.getSession();
    return (
        <>
            {user.data.session?.user ? (
                <DashBoard></DashBoard>
            ) : (
                <Login initialHasAccount={searchParams.hasAccount === 'true' ? false : true}></Login>
            )}
        </>
    );
}