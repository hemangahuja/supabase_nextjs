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
    const [name, setName] = useState("");
    const [category, setCategory] = useState("student");
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
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }
        await supabase.from("users").insert({
            id: data.session?.user.id,
            name,
            category,
            email,
        });
        await handleSignIn();
    };
    return (
        <div className="w-full h-full flex-col flex">
            <a
                className="js-link mb-3"
                onClick={() => setHasAccount((prev) => !prev)}
            >
                {hasAccount
                    ? "Don't have an account?"
                    : "Already have an account?"}
            </a>

            <div className="form-group">
                <label htmlFor="user-email">Email</label>
                <input
                    id="user-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your e-mail address"
                    type="email"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="user-password">Password</label>
                <input
                    id="user-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    type="password"
                    required
                />
            </div>
            {!hasAccount && (
                <>
                    <div className="form-group">
                        <label htmlFor="user-name">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-category">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option disabled selected>
                                Select a category...
                            </option>
                            <option>Proctor</option>
                            <option>Student</option>
                        </select>
                    </div>
                </>
            )}

            {error ? <div className="error">{error}</div> : ""}

            <div className="submit-wrapper">
                <button
                    className="submit-btn"
                    onClick={hasAccount ? handleSignIn : handleSignUp}
                >
                    {hasAccount
                        ? loading
                            ? "Logging in.."
                            : "Login"
                        : loading
                        ? "Creating account.."
                        : "Sign up"}
                </button>
            </div>
        </div>
    );
}
