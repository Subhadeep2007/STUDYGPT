import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    title: {
        type: String,
        trim: true,
        maxlength: 100,
        default: "New Chat"
    },

    lastMessageAt: {
        type: Date,
        default: null,
        index: true
    },

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});


// Faster chat-history queries
chatSchema.index({
    userId: 1,
    isDeleted: 1,
    updatedAt: -1
});


const Chat =
    mongoose.models.Chat ||
    mongoose.model("Chat", chatSchema);

export default Chat;