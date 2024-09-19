
import { loadPDF } from "@/lib/web-pdf-loader";
import { utapi } from "@/sever/uploadthing";
import Link from "next/link";

const FilesList = async () => {
    const files = await utapi.listFiles();

    const pdfChunks = await loadPDF("https://utfs.io/f/SNR6PmuhTyeC7XqstuFlpvMgTt2U43irzx1JnXQuDPS0LVEj");

    console.log(pdfChunks[0].metadata.pdf.info.Title);



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