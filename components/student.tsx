import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Student({ data }: { data: any }) {
    const supabase = createServerComponentClient({ cookies });
    const tests = await supabase.from("test").select();
    const userID = (await supabase.auth.getSession()).data.session?.user.id;
    const registeredTests = await supabase
        .from("user_test")
        .select("id")
        .eq("user_id", userID);
    const set = new Set(registeredTests.data);
    console.log(tests.data);
    return (
        <>
            You are a student
            {tests.data?.map((test) => (
                <div key={test.id}>
                    {JSON.stringify(test)} registered ={" "}
                    {set.has(test.id) ? "yes" : "false"}
                </div>
            ))}
        </>
    );
}
