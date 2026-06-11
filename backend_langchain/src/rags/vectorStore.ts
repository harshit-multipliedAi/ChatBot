import {Chroma} from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embedding.ts";

export const COLLECTION_NAME = "multiplied-ai-docs";
export async function getVectorStore() {
    return new Chroma(embeddings,{
        collectionName: COLLECTION_NAME,
        url: "http://localhost:8000"
    });
}