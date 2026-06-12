import {graph} from "./graph.ts";

async function main() {
    const result = await graph.invoke({
        question: "What is rag?",
    })
    console.log(result);
}

main();