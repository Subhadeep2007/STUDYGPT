import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
        // ===============================
        // OWNER
        // ===============================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // ===============================
        // CHAT
        // ===============================

        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            default: null,
            index: true
        },

        // ===============================
        // BASIC FILE INFO
        // ===============================

        originalName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        mimeType: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: Number,
            required: true,
            min: 0
        },

        // ===============================
        // CLOUDINARY
        // ===============================

        cloudinaryUrl: {
            type: String,
            default: ""
        },

        cloudinaryPublicId: {
            type: String,
            default: ""
        },

        // image / raw / auto etc.
        cloudinaryResourceType: {
            type: String,
            default: "raw"
        },

        // ===============================
        // GEMINI FILE API
        // ===============================

        geminiFileName: {
            type: String,
            default: ""
        },

        geminiFileUri: {
            type: String,
            default: ""
        },

        geminiMimeType: {
            type: String,
            default: ""
        },

        // ===============================
        // PROCESSING STATUS
        // ===============================

        status: {
            type: String,

            enum: [
                "uploading",
                "processing",
                "ready",
                "failed"
            ],

            default: "uploading"
        },

        errorMessage: {
            type: String,
            default: null
        },

        // ===============================
        // FILE PURPOSE
        // ===============================

        purpose: {
            type: String,

            enum: [
                "chat",
                "profile"
            ],

            default: "chat"
        }
    },

    {
        timestamps: true
    }
);


// ========================================
// INDEXES
// ========================================

fileSchema.index({
    userId: 1,
    createdAt: -1
});

fileSchema.index({
    chatId: 1,
    createdAt: -1
});


const File =
    mongoose.models.File ||
    mongoose.model("File", fileSchema);

export default File;