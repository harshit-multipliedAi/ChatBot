import type { Request, Response } from "express";
import { askChatbot } from "../services/chatService.ts";

export async function chatController(req: Request, res: Response) {
    try {
        const { conversationId, message } = req.body;
        // console.log("conversation id in controller before calling:", conversationId);
        const answer = await askChatbot(conversationId, message);
        res.json({
            success: true,
            reply: answer
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
        });
    }
}