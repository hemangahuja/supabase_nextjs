import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Proctor from "./proctor";
import Student from "./student";

export default async function TodoViewer() {
    const supabase = createServerComponentClient({ cookies });
    const data = await supabase.from("users").select("name,category");
    const row = data.data?.at(0);
    const isProctor = row?.category == "proctor";
    const tests = (await supabase.from("test").select("id,description")).data;
    const userID = (await supabase.auth.getSession()).data.session?.user.id;
    const registeredTests = await supabase
        .from("user_test")
        .select("test_id")
        .eq("user_id", userID);
    const set = new Set(registeredTests.data?.map((x) => x.test_id));
    return (
        <>
            {isProctor ? (
                <Proctor tests={tests} registered={set}></Proctor>
            ) : (
                <Student tests={tests} registered={set}></Student>
            )}
        </>
    );
}
