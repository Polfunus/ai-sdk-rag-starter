"use client";


import { Button } from "@/components/ui/button";
import { createPDFResource } from "@/lib/actions/resources";

const PdfForm = () => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const url = formData.get("url") as string;
        try {
            const message = await createPDFResource(url);

            console.log(message);

        } catch (error) {
            console.error(error);
        } finally {
            // reset form
            (event.target as HTMLFormElement).reset();
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <input
                name="url"
                type="url"
                placeholder="PDF URL"
                className="border border-gray-300 rounded-md p-2"
            />
            <Button type="submit">
                Generate PDF Resource
            </Button>
        </form>
    )
}

export default PdfForm