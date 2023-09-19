"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hasAccount, setHasAccount] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();
    const handleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else router.refresh();
    };
    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        await handleSignIn();
    };
    return (
        <>
            {error && error}
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
            ></input>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            ></input>
            <button onClick={hasAccount ? handleSignIn : handleSignUp}>
                {hasAccount
                    ? loading
                        ? "logging in.."
                        : "Login"
                    : loading
                    ? "signing in.."
                    : "SignUp"}
            </button>
            <button onClick={() => setHasAccount((prev) => !prev)}>
                {hasAccount
                    ? "Don't have an account?"
                    : "Already have an account?"}
            </button>
        </>
    );
}
