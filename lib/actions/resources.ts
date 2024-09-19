"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { db } from "../db";
import { generateEmbeddings, generatePDFEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from '../db/schema/embeddings'
import { loadPDF } from "../web-pdf-loader";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      }))
    )

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};

export const createPDFResource = async (url: string) => {

  console.log("Creating PDF resource from URL:", url);

  const pdfChunks = await loadPDF(url);


  //convert pdfChunks to a array of strings
  const title = pdfChunks[0].metadata.pdf.info.Title;

  const input = {
    content: title,
  }

  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();


    const embeddings = await generatePDFEmbeddings(url);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      }))
    )

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
