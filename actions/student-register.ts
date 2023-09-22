"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function StudentAction(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const session = await supabase.auth.getSession();
    const userID = session.data.session?.user.id;

    const { error } = await supabase.from("user_test").insert({
        user_id: userID,
        test_id: formData.get("test"),
    });
    console.log(error);
    redirect(`test/${formData.get("test")}`);
}
export default StudentAction;
