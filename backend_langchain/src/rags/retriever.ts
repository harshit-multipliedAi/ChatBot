import { getVectorStore } from "./vectorStore.ts";

export async function retrieveRelevantDocs(query:string) {
    const vectorStore = await getVectorStore();
    const docs = vectorStore.similaritySearch(query,4);
    return docs;
}