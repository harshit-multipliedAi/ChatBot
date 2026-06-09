import mongoose, { mongo } from "mongoose";

const ConversationSchema = new mongoose.Schema(
    {
        userID:{
            type: String,
            require: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Conversation", ConversationSchema);
