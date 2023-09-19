"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();
    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.refresh();
    };
    return (
        <>
            <button onClick={handleSignOut} disabled={loading}>
                {loading ? "signing out.." : "signout"}
            </button>
        </>
    );
}
