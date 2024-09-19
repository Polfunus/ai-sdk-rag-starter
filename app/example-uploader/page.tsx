
import { Suspense } from "react";
import FilesList from "@/components/FilesList";
import UploadFile from "@/components/UploadFile";
import PdfForm from "./_components/PdfForm";

export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <UploadFile />
            <Suspense fallback={<div>Loading...</div>}>
                <FilesList />
            </Suspense>
            <PdfForm />
        </main>
    );
}
