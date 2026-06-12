import "dotenv/config";
import { createAgent } from "langchain";
import { companyDocsTools } from "./tools/companyDocsTools.ts";

export const agent = createAgent({
    model: "gpt-4o",
    tools: [
        companyDocsTools
    ]
});