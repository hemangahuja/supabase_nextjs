"use client";

import ProctorAction from "@/actions/proctor-register";
import { useRef, useState } from "react";

export default function Proctor({
    tests,
    registered,
}: {
    tests: any;
    registered: Set<any>;
}) {
    const [testID, setTestID] = useState("");
    const [password, setPassword] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <form
            ref={formRef}
            action={async (formData: FormData) => {
                formData.set("test", testID);
                formData.set("pass", password);
                console.log(formData);
                await ProctorAction(formData);
            }}
            className="flex flex-col gap-5"
        >
            {tests.map((test: any) => (
                <button
                    type="button"
                    onClick={(e) => {
                        if (registered.has(test.id)) {
                            alert("Already registered");
                            return;
                        }
                        setPassword(prompt("Enter Password") || "");
                        setTestID(test.id);
                        formRef.current?.submit();
                    }}
                    key={test.id}
                >
                    {test.description}{" "}
                    {registered.has(test.id) && "Already Registered"}
                </button>
            ))}
        </form>
    );
}
