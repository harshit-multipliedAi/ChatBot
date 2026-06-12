import {tool} from "@langchain/core/tools";
import {z} from "zod";
import { getVectorStore } from "../../rags/vectorStore.ts";

export const companyDocsTools = tool(
    async({query})=>{
        console.log("Tool Called: ", query);
        const vectorStore = await getVectorStore();
        const docs = await vectorStore.similaritySearch(query,4);
        console.log(docs);
        return docs.map(
            (doc,index)=> `Document ${index+1}
            Source: ${doc.metadata?.source??"unknown"}
            ${doc.pageContent}`
        ).join("\n\n");
    },
    {
        name: "company_docs",
        description:"Searches Multiplied AI company documentation including PDFs and website content. Use this whenever the user asks company-specific questions.",
        schema: z.object({
            query: z.string(),
        }),
    }
);
