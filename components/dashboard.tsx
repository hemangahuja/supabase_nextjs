import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Logout from "@/components/logout";
import TodoViewer from "./todo_viewer";
import TodoAdder from "./todo_adder";
export default async function DashBoard() {
    const supabase = createServerComponentClient({ cookies });
    const user = await supabase.auth.getUser();
    return (
        <>
            <Logout></Logout>
            <div>Hello {user.data.user?.email}</div>
            <TodoViewer></TodoViewer>
        </>
    );
}
