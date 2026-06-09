import mongoose, { mongo } from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        conversationId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            require: true
        },
        role: {
            type: String,
            enum: ["system","user","assistant"],
            require: true
        },
        content:{
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "Message", MessageSchema
)