import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
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
        required: true
    },

    emailVerificationOTP: {
        type: String,
        required: true
    },

    emailVerificationOTPExpire: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const PendingUser =
    mongoose.models.PendingUser ||
    mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;