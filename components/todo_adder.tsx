"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import SubmitTextAction from "@/actions/submit-text";
import { useRef } from "react";
export default async function TodoAdder() {
    const formRef = useRef<HTMLFormElement>(null);
    return (
        <form
            ref={formRef}
            action={async (formData: FormData) => {
                formRef.current?.reset();
                await SubmitTextAction(formData);
            }}
        >
            <input type="text" placeholder="text" name="text" />l
            <Button></Button>
        </form>
    );
}

const Button = () => {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}>
            {pending ? "loading" : "submit"}
        </button>
    );
};
