import fs from "fs";
import path from "path";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

export async function loadAllPDFs(): Promise<Document[]> {
  const documentsDir = path.join(
    process.cwd(),
    "src",
    "rags",
    "documents"
  );

  const files = fs
    .readdirSync(documentsDir)
    .filter((file) => file.endsWith(".pdf"));

  const allDocs: Document[] = [];

  for (const file of files) {
    console.log(`📄 Loading ${file}`);

    const loader = new PDFLoader(
      path.join(documentsDir, file)
    );

    const docs = await loader.load();

    docs.forEach((doc) => {
      allDocs.push(
        new Document({
          pageContent: doc.pageContent,
          metadata: {
            source: file,
            type: "pdf",
            page:
              typeof doc.metadata?.loc?.pageNumber === "number"
                ? doc.metadata.loc.pageNumber
                : 0,
          },
        })
      );
    });
  }

  return allDocs;
}