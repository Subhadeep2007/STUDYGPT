import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    profileImage: {
        type: String,
        default: ""
    },

    // ✅ Needed to delete/replace image from Cloudinary
    profileImagePublicId: {
        type: String,
        default: ""
    },

    isEmailVerified: {
        type: Boolean,
        default: true
    },

    refreshToken: {
        type: String,
        default: null
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastSeen: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);

export default User;