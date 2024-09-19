
import { loadPDF } from "@/lib/web-pdf-loader";
import { utapi } from "@/sever/uploadthing";
import Link from "next/link";

const FilesList = async () => {
    const files = await utapi.listFiles();



    return (
        <div className="flex flex-col gap-4">
            <h2 className="font-bold text-xl">
                List of uploaded files:
            </h2>
            <ul className="space-y-2 list-disc ml-[2ch]">
                {files.files.map((file) => (
                    <li key={file.id} className="underline">
                        <Link href={`https://utfs.io/f/${file.key}`} target="_blank" rel="nofollow noreferrer">
                            {file.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FilesList