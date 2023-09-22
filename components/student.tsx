"use client";
import StudentAction from "@/actions/student-register";
import { useRef, useState } from "react";

export default function Student({
    tests,
    registered,
}: {
    tests: any;
    registered: Set<any>;
}) {
    console.log(registered);
    const [testID, setTestID] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <form
            ref={formRef}
            action={async (formData: FormData) => {
                formData.set("test", testID);
                await StudentAction(formData);
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
