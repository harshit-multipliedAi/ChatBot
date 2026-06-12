import "dotenv/config";
import { StateGraph, START, END, StateSchema, type GraphNode } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod/v4";

const model = new ChatOpenAI({
    model: "gpt-4o-mini"
})

const State = new StateSchema({
    question: z.string(),
    intent: z.string(),
    answer: z.string(),
});

const classifierNode: GraphNode<typeof State> = async(state)=>{
    const regex = /^[0-9+\-*/().\s]+$/;
    const intent = regex.test(state.question)? "math": "general";
    return {
        intent: intent
    };
}

const calculatorNode: GraphNode<typeof State>  = async(state)=>{
    const result = Function(
        `"use strict"; return (${state.question})`
    )();
    return {
        answer: String(result)
    };
}
const llmNode: GraphNode<typeof State> = async(state)=>{
    const response = await model.invoke(state.question);
    console.log(response.content)
    return {
        answer: String(response.content)
    };
}

export const graph = new StateGraph(State)
    .addNode("classifier",classifierNode)
    .addNode("calculator",calculatorNode)
    .addNode("llm",llmNode)
    .addEdge("__start__","classifier")
    .addConditionalEdges("classifier",(state)=>{ return state.intent==="math"?"calculator":"llm";})
    .addEdge("calculator","__end__")
    .addEdge("llm","__end__")
    .compile();



// async function classifierNode(state:GraphState) {
//     const regex = /^[0-9+\-*/().\s]+$/;
//     const intent = regex.test(state.question)? "math": "general";
//     return intent;
// }

// async function calculatorNode(state:GraphState) {
//     const result = Function(
//         `"use strict"; return (${state.question})`
//     )();

//     return {
//         answer: String(result),
//     };
// }

// async function llmNode(state :GraphState) {
//     const response = await model.invoke(state.question);
//     return {
//         answer: response.content.toString(),
//     };
// }

// const graph = new StateGraph<GraphState>();
// graph.addNode("classifier", classifierNode);
// graph.addNode("calculator", calculatorNode);
// graph.addNode("llm", llmNode);
// graph.addEdge(START,"classifier");
// graph.addConditionalEdges( "classifier",(state)=>{
//     return state.intent ==="math"?"calculator":"llm";
// });
// graph.addEdge("calculator", END);
// graph.addEdge("llm",END);

// export const app = graph.compile()