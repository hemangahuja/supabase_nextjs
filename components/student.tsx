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
                <div className="test-item">
                    <div className="test-item-title text-lg text-center">
                        {test.description}
                    </div>

                    <div className="badges"></div>

                    <div className="test-actions">
                        {registered.has(test.id) ? (
                            <div className="">
                                You are registered for this test.
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    if (registered.has(test.id)) {
                                        alert("Already registered");
                                        return;
                                    }
                                    await submit(test.id);
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
