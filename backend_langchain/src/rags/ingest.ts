import "dotenv/config";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import {client, COLLECTION_NAME, getVectorStore} from "./vectorStore.ts";

import { loadAllPDFs } from "./loaders/pdfLoader";
import { loadWebsiteDocs } from "./loaders/websiteLoader";

async function ingest() {
  console.log("Loading PDFs...");
  const pdfDocs = await loadAllPDFs();

  console.log("Loading Website...");
  const websiteDocs = await loadWebsiteDocs();

  const allDocs = [...pdfDocs, ...websiteDocs];

  // console.log(`Total documents: ${allDocs.length}`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(allDocs);
    try {
      await client.deleteCollection({
          name: COLLECTION_NAME,
      });

      // console.log("Old collection deleted");
  } catch {
      console.log("Collection did not exist");
  }
  // console.log(splitDocs);

  const vectorStore = await getVectorStore();

  await vectorStore.addDocuments(splitDocs);

  // console.log(
    // `Successfully indexed ${splitDocs.length} chunks.`
  // );
}

ingest().catch(console.error);