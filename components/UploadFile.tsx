"use client";

import { UploadButton } from "@/lib/uploadthing";
import Link from "next/link";
import { useState } from "react";

const UploadFile = () => {

    const [fileURL, setFileURL] = useState<string | null>(null);

    return (
        <>
            <UploadButton
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    setFileURL(res[0].appUrl);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
            {fileURL &&
                <Link href={fileURL} target="_blank" rel="nofollow noreferrer">
                    View your file
                </Link>
            }
        </>
    )
}

export default UploadFile