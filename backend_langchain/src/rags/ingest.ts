// import "dotenv/config"
// import fs from "fs";
// import path from "path";
// import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
// import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
// import { getVectorStore } from "./vectorStore.ts";

// async function ingest(){
//     const documentsDir = path.join(process.cwd(),"src","rags","documents");
//     const files = fs.readdirSync(documentsDir).filter((file)=> file.endsWith(".pdf"));

//     if(files.length===0){
//         console.log("No pdf file found.")
//         return;
//     }
//     const vectorStore = await getVectorStore();
//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,
//         chunkOverlap: 200,
//     });

//     for(const file of files){
//         console.log(`Processing ${file}...`);
//         const loader = new PDFLoader(path.join(documentsDir,file));
//         const docs = await loader.load();

//         const texts = docs.map((d) => d.pageContent);

//         const splitTexts = await splitter.createDocuments(
//         texts,
//         docs.map(() => ({
//             source: file,
//             type: "pdf",
//         }))
//         );

//         await vectorStore.addDocuments(splitTexts);
//         console.log(`Added ${splitTexts.length} chunks from ${file}`);
//     }
//     console.log("Ingestion Completed.");
// }
// ingest().catch(console.error);
import "dotenv/config";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { getVectorStore } from "./vectorStore";
import { loadAllPDFs } from "./loaders/pdfLoader";
import { loadWebsiteDocs } from "./loaders/websiteLoader";

async function ingest() {
  console.log("Loading PDFs...");
  const pdfDocs = await loadAllPDFs();

  console.log("Loading Website...");
  const websiteDocs = await loadWebsiteDocs();

  const allDocs = [...pdfDocs, ...websiteDocs];

  console.log(`Total documents: ${allDocs.length}`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(allDocs);

  const vectorStore = await getVectorStore();

  await vectorStore.addDocuments(splitDocs);

  console.log(
    `Successfully indexed ${splitDocs.length} chunks.`
  );
}

ingest().catch(console.error);