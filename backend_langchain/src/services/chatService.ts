import Conversation from "../db/Conversation.model.ts"
import Message from "../db/Message.model.ts"
import {agent} from "../langchain/agent.ts"
import { systemPrompt } from "../prompts/systemPrompt.ts";

export async function askChatbot(
    conversationId: string|null,
    message: string
) {
    let currentConversationId = conversationId;
    // console.log("Conversation id before if: ", currentConversationId);
    if(!currentConversationId){
        const conversation = await Conversation.create({});
        currentConversationId = conversation._id.toString();
    }

    // console.log("Conversation id after if: ", currentConversationId);

    await Message.create({
        conversationId: currentConversationId,
        role: "user",
        content: message
    })
    const history = await Message.find({conversationId:currentConversationId}).sort({ createdAt: -1 }).limit(20);

    // console.log(history)
    const promptMessage: any = [
        {
            type: "system",
            content: systemPrompt
        },
            ...history.filter((msg)=>(msg.role === "user"|| msg.role === "assistant") && msg.content !=null)
            .map((msg)=>({
                type: msg.role,
                content: msg.content
            })),{
                type: "user",
                content: message
            }
    ];

    const response = await agent.invoke({
        messages: promptMessage
    })
    // console.log(response)

    const lastMessage = response.messages[response.messages.length - 1];
    const reply = typeof lastMessage?.content === "string" ? lastMessage.content : "";
    // console.log(reply)
    await Message.create({
        conversationId: currentConversationId,
        role: "assistant",
        content: reply
    })
    return {
        conversationId: currentConversationId,
        reply,
    }
}
