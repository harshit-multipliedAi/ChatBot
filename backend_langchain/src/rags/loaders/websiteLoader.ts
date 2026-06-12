// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
// import {PlaywrightWebBaseLoader} from "@langchain/community/document_loaders/web/playwright"
// import { Document } from "@langchain/core/documents";

// const urls = [
//   "https://www.multiplied.ai/",
//   "https://www.multiplied.ai/humanticos",
//   "https://www.multiplied.ai/solutions",
//   "https://www.multiplied.ai/company",
//   "https://www.multiplied.ai/careers"
// ];

// export async function loadWebsiteDocs(): Promise<Document[]> {
//   const allDocs: Document[] = [];

//   for (const url of urls) {
//     console.log(`🌐 Loading ${url}`);

//     // const loader = new CheerioWebBaseLoader(url);
//     const loader = new PlaywrightWebBaseLoader(url);

//     const docs = await loader.load();

//     docs.forEach((doc) => {
//       allDocs.push(
//         new Document({
//           pageContent: doc.pageContent,
//           metadata: {
//             source: url,
//             type: "website",
//           },
//         })
//       );
//     });
//   }

//   return allDocs;
// }
import { chromium } from "playwright";
import { Document } from "@langchain/core/documents";

const urls = [
  "https://www.multiplied.ai/",
  "https://www.multiplied.ai/company",
  "https://www.multiplied.ai/solutions",
  "https://www.multiplied.ai/careers",
  "https://www.multiplied.ai/humanticos",
];

export async function loadWebsiteDocs() {
  const browser = await chromium.launch({
    headless: true,
  });

  const docs: Document[] = [];

  for (const url of urls) {
    // console.log(url);

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle",
    });

    const text = await page.evaluate(() => {
      return document.body.innerText;
    });

    docs.push(
      new Document({
        pageContent: text,
        metadata: {
          source: url,
          type: "website",
        },
      })
    );

    await page.close();
  }

  await browser.close();

  return docs;
}