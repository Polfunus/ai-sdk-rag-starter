"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createPDFResource } from "@/lib/actions/resources";
import { Input } from "@/components/ui/input";

const PdfForm = () => {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const url = formData.get("url") as string;

        if (!url) {
            console.error("No URL provided");
            return;
        }

        try {
            setLoading(true);
            const message = await createPDFResource(url);

            console.log(message);
            alert(message);


        } catch (error) {
            console.error(error);
        } finally {
            // reset form
            setLoading(false);
            (event.target as HTMLFormElement).reset();
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
        >
            <Input
                name="url"
                type="url"
                placeholder="PDF URL"
                className="border border-gray-300 rounded-md p-2"
                disabled={loading}
            />
            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload PDF"}
            </Button>
        </form>
    )
}

export default PdfForm