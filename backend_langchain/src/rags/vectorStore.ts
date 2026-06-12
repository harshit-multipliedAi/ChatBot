// import {Chroma} from "@langchain/community/vectorstores/chroma";
// import { embeddings } from "./embedding.ts";

// export const COLLECTION_NAME = "multiplied-ai-docs";
// export async function getVectorStore() {
//     return new Chroma(embeddings,{
//         collectionName: COLLECTION_NAME,
//         url: "http://localhost:8000"
//     });
// }

// export async function clearStore(){
//     const store = await getVectorStore();
//     await store.delete({
//         filter: {},
//     });
// }
import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./embedding.ts";

export const COLLECTION_NAME = "multiplied-ai-docs";

export const client = new ChromaClient({
  path: "http://localhost:8000",
});

export async function getVectorStore() {
  return new Chroma(embeddings, {
    collectionName: COLLECTION_NAME,
    url: "http://localhost:8000",
  });
}