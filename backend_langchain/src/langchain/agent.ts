import "dotenv/config";
import { createAgent } from "langchain";

export const agent = createAgent({
    model: "gpt-4o"
});