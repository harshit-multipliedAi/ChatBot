import "dotenv/config";
import { retrieveRelevantDocs } from "./retriever.ts";

async function test() {
    const docs = await retrieveRelevantDocs(
        "Tell me about job opening in this company."
    );
    console.log(
        docs.map((doc)=>({
            content: doc.pageContent,
            metadata: doc.metadata
        }))
    );
}

test().catch(console.error);