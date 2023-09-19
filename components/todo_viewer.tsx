import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function TodoViewer() {
    const supabase = createServerComponentClient({ cookies });
    const data = await supabase.from("t").select();
    return <>{JSON.stringify(data)}</>;
}
