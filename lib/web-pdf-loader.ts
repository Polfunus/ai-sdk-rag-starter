import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export async function loadPDF(url: string) {
    const response = await fetch(url);
    const data = await response.blob();
    const loader = new WebPDFLoader(data, {
        splitPages: false,
    });
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });
    const allSplits = await splitter.splitDocuments(docs);

    return allSplits;
}
