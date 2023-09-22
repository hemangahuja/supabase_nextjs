"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function ProctorAction(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const session = await supabase.auth.getSession();
    const userID = session.data.session?.user.id;
    const isAuthenticated = await supabase.rpc("verify_password", {
        input_id: formData.get("test"),
        input_password: formData.get("pass"),
    });
    console.log(formData);
    if (!isAuthenticated.data) {
        return;
    }
    await supabase.from("user_test").insert({
        user_id: userID,
        test_id: formData.get("test"),
    });
    redirect(`test/${formData.get("test")}`);
}
export default ProctorAction;
