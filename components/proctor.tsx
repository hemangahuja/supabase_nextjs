"use client";

import ProctorAction from "@/actions/proctor-register";
import { useRouter } from "next/navigation";

export default function Proctor({
    tests,
    registered,
}: {
    tests: any;
    registered: Set<any>;
}) {
    const router = useRouter();
    return (
        <form className="flex flex-col gap-5">
            {tests.map((test: any) => (
                <div key={test.id} className="test-item">
                    <div className="test-item-title text-lg text-center">
                        {test.description}
                    </div>

                    <div className="badges"></div>

                    <div className="test-actions">
                        {registered.has(test.id) ? (
                            <div
                                onClick={(e) => {
                                    router.push(`/test/${test.id}`);
                                }}
                                className="hover:cursor-pointer"
                            >
                                Click to start proctoring
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    const password =
                                        prompt("Enter password") || "";
                                    const formData = new FormData();
                                    formData.set("test", test.id);
                                    formData.set("pass", password);
                                    await ProctorAction(formData);
                                }}
                                key={test.id}
                                className="btn text-sm"
                            >
                                Register
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </form>
    );
}
