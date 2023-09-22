"use client";

import ProctorAction from "@/actions/proctor-register";

export default function Proctor({
    tests,
    registeredids,
}: {
    tests: any;
    registeredids: Set<any>;
}) {
    return (
        <form className="flex flex-col gap-5">
            {tests.map((test: any) => (
                <button
                    type="button"
                    onClick={async (e) => {
                        if (registered.has(test.id)) {
                            alert("Already registered");
                            return;
                        }
                        const password = prompt("Enter Password") || "";
                        const formData = new FormData();
                        formData.set("test", test.id);
                        formData.set("pass", password);
                        await ProctorAction(formData);
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
