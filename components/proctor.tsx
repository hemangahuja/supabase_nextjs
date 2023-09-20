import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Proctor({ data }: { data: any }) {
    async function action(formData: FormData) {
        "use server";
        const supabase = createServerActionClient({ cookies });
        const session = await supabase.auth.getSession();
        const userID = session.data.session?.user.id;
        const rows = await supabase
            .from("test")
            .select()
            .eq("id", formData.get("id"))
            .eq("password", formData.get("pass"));
        console.log(rows);
        if (rows.data?.length) {
            await supabase.from("user_test").insert({
                user_id: userID,
                test_id: formData.get("id"),
            });
            redirect(`proctor/${formData.get("id")}`);
        }
    }
    return (
        <form action={action}>
            <input type="text" name="id" />
            <input type="password" name="pass" />
            <button type="submit">find test</button>
        </form>
    );
}
