"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function SubmitTextAction(formData: FormData) {
    const supabase = createServerActionClient({ cookies });
    const res = await supabase.from("t").insert({ text: formData.get("text") });
    console.log(res);
    revalidatePath("/");
}
