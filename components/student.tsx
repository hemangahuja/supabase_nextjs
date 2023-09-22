"use client";
import StudentAction from "@/actions/student-register";

export default function Student({
    tests,
    registered,
}: {
    tests: any;
    registered: Set<any>;
}) {
    const submit = async (id: any) => {
        const formData = new FormData();
        formData.set("test", id);
        console.log(formData);
        await StudentAction(formData);
    };

    return (
        <form className="flex flex-col gap-5">
            {tests.map((test: any) => (
                <button
                    type="button"
                    onClick={async () => {
                        if (registered.has(test.id)) {
                            alert("Already registered");
                            return;
                        }
                        await submit(test.id);
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
