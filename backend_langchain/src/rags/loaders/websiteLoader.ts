import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { Document } from "@langchain/core/documents";

const urls = [
  "https://www.multiplied.ai/",
  "https://www.multiplied.ai/humanticos",
  "https://www.multiplied.ai/solutions",
  "https://www.multiplied.ai/company",
  "https://www.multiplied.ai/careers"
];

export async function loadWebsiteDocs(): Promise<Document[]> {
  const allDocs: Document[] = [];

  for (const url of urls) {
    console.log(`🌐 Loading ${url}`);

    const loader = new CheerioWebBaseLoader(url);

    const docs = await loader.load();

    docs.forEach((doc) => {
      allDocs.push(
        new Document({
          pageContent: doc.pageContent,
          metadata: {
            source: url,
            type: "website",
          },
        })
      );
    });
  }

  return allDocs;
}