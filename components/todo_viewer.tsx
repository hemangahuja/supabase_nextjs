import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Proctor from "./proctor";
import Student from "./student";

export default async function TodoViewer() {
    const supabase = createServerComponentClient({ cookies });
    const data = await supabase.from("users").select("name,category");
    const row = data.data?.at(0);
    const isProctor = row?.category == "proctor";
    return (
        <>
            {isProctor ? (
                <Proctor data={row}></Proctor>
            ) : (
                <Student data={row}></Student>
            )}
        </>
    );
}
