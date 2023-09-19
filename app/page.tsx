import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Login from "@/components/login";
import DashBoard from "@/components/dashboard";

export default async function Index() {
    const supabase = createServerComponentClient({ cookies });
    const user = await supabase.auth.getSession();

    return (
        <>
            {user.data.session?.user ? (
                <DashBoard></DashBoard>
            ) : (
                <Login></Login>
            )}
        </>
    );
}
