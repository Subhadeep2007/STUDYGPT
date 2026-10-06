import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        default: null
    },

    filename: {
        type: String,
        trim: true,
        maxlength: 255
    },

    mimeType: {
        type: String,
        trim: true
    },

    fileUrl: {
        type: String,
        trim: true
    }
}, {
    _id: false
});


const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },

    content: {
        type: String,
        trim: true,
        default: ""
    },

    attachments: {
        type: [attachmentSchema],
        default: []
    },

    // AI model used for assistant response
    model: {
        type: String,
        trim: true,
        default: null
    },

    // Used when a user edits an old message
    isEdited: {
        type: Boolean,
        default: false
    },

    editedAt: {
        type: Date,
        default: null
    },

    // Useful for failed/processing AI messages
    status: {
        type: String,
        enum: [
            "sent",
            "processing",
            "completed",
            "failed"
        ],
        default: "sent"
    },

    // Store error only when AI generation fails
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});


// ===============================
// INDEXES
// ===============================

// Get messages of a chat in order
messageSchema.index({
    chatId: 1,
    createdAt: 1
});


// Get user's messages efficiently
messageSchema.index({
    userId: 1,
    createdAt: -1
});


const Message =
    mongoose.models.Message ||
    mongoose.model("Message", messageSchema);

export default Message;