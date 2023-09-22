import Room from "@/components/room";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Proctor({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const userID = (await supabase.auth.getSession()).data.session?.user.id;
    const row = await supabase
        .from("user_test")
        .select()
        .eq("test_id", params.id)
        .eq("user_id", userID);

    if (!row.data?.length) redirect("/");
    const test = await supabase.from("test").select().eq("id", params.id);
    return <Room roomName={params.id} userName={userID!}></Room>;
}
