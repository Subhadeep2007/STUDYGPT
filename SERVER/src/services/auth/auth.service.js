import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/user.js";
import PendingUser from "../../models/pendingUser.js";

import generateOTP from "../../utils/generateOTP.js";
import sendEmail from "../../utils/sendEmail.js";

import {
    generateAccessToken,
    generateRefreshToken
} from "../../utils/generateToken.js";


const registerUser = async({
    name,
    email,
    password
}) => {
    // Check actual user
    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new Error(
            "User with this email already exists"
        );
    }

    // Hash password BEFORE storing in pending collection
    const hashedPassword =
        await bcrypt.hash(password, 12);

    const otp = generateOTP();

    const otpExpire =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    // Remove old pending registration
    await PendingUser.findOneAndDelete({
        email
    });

    // Create pending user ONLY
    await PendingUser.create({
        name,
        email,
        password: hashedPassword,
        emailVerificationOTP: otp,
        emailVerificationOTPExpire: otpExpire
    });

    try {
        await sendEmail({
            to: email,

            subject: "Verify your StudyGPT account",

            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Welcome to StudyGPT</h2>

                    <p>Hello ${name},</p>

                    <p>
                        Your StudyGPT verification OTP is:
                    </p>

                    <h1>${otp}</h1>

                    <p>
                        This OTP will expire in 10 minutes.
                    </p>

                    <p>
                        If you did not create this account,
                        you can ignore this email.
                    </p>
                </div>
            `
        });
    } catch (error) {
        await PendingUser.findOneAndDelete({
            email
        });

        throw new Error(
            "Unable to send verification email. Please try again."
        );
    }

    return {
        email,
        requiresEmailVerification: true
    };
};


const verifyEmail = async({
    email,
    otp
}) => {
    const pendingUser =
        await PendingUser.findOne({
            email
        });

    if (!pendingUser) {
        throw new Error(
            "Registration request not found or already verified"
        );
    }

    if (
        pendingUser.emailVerificationOTPExpire <
        new Date()
    ) {
        throw new Error(
            "Verification OTP has expired"
        );
    }

    if (
        pendingUser.emailVerificationOTP !== otp
    ) {
        throw new Error(
            "Invalid verification OTP"
        );
    }

    // Double safety check
    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        await PendingUser.deleteOne({
            _id: pendingUser._id
        });

        throw new Error(
            "User with this email already exists"
        );
    }

    // ONLY NOW actual User is created
    const user = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        password: pendingUser.password,
        isEmailVerified: true
    });

    // Delete pending registration
    await PendingUser.deleteOne({
        _id: pendingUser._id
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
    };
};


const resendVerificationOTP = async(
    email
) => {
    const pendingUser =
        await PendingUser.findOne({
            email
        });

    if (!pendingUser) {
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            throw new Error(
                "Email is already verified"
            );
        }

        throw new Error(
            "Registration request not found"
        );
    }

    const otp = generateOTP();

    const otpExpire =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    pendingUser.emailVerificationOTP =
        otp;

    pendingUser.emailVerificationOTPExpire =
        otpExpire;

    await pendingUser.save();

    await sendEmail({
        to: email,

        subject: "Your new StudyGPT verification OTP",

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>StudyGPT Email Verification</h2>

                <p>Hello ${pendingUser.name},</p>

                <p>Your new OTP is:</p>

                <h1>${otp}</h1>

                <p>
                    This OTP will expire in 10 minutes.
                </p>
            </div>
        `
    });

    return {
        email: pendingUser.email
    };
};


const loginUser = async({
    email,
    password
}) => {
    const user =
        await User.findOne({ email });

    if (!user) {
        // Check if user is still pending
        const pendingUser =
            await PendingUser.findOne({
                email
            });

        if (pendingUser) {
            throw new Error(
                "Please verify your email before login"
            );
        }

        throw new Error(
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new Error(
            "Your account is inactive"
        );
    }

    const isPasswordCorrect =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new Error(
            "Invalid email or password"
        );
    }

    if (!user.isEmailVerified) {
        throw new Error(
            "Please verify your email before login"
        );
    }

    const accessToken =
        generateAccessToken(
            user._id.toString()
        );

    const refreshToken =
        generateRefreshToken(
            user._id.toString()
        );

    user.refreshToken =
        refreshToken;

    user.lastSeen = new Date();

    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profileImage: user.profileImage
        },

        accessToken,

        refreshToken
    };
};


const refreshAccessToken = async(
    refreshToken
) => {
    if (!refreshToken) {
        throw new Error(
            "Refresh token not found"
        );
    }

    const user =
        await User.findOne({
            refreshToken
        });

    if (!user) {
        throw new Error(
            "Invalid refresh token"
        );
    }

    try {
        const decoded =
            jwt.verify(
                refreshToken,
                process.env.JWT_SECRET
            );

        if (
            decoded.userId !==
            user._id.toString()
        ) {
            throw new Error(
                "Invalid refresh token"
            );
        }

        const accessToken =
            generateAccessToken(
                user._id.toString()
            );

        return {
            accessToken,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                profileImage: user.profileImage
            }
        };

    } catch (error) {
        throw new Error(
            "Invalid or expired refresh token"
        );
    }
};


const logoutUser = async(
    refreshToken
) => {
    if (!refreshToken) {
        return;
    }

    await User.findOneAndUpdate({ refreshToken }, {
        $set: {
            refreshToken: null
        }
    });
};


const forgotPassword = async(
    email
) => {
    const user =
        await User.findOne({ email });

    // Do not reveal account existence
    if (!user || !user.isActive) {
        return;
    }

    const otp = generateOTP();

    const otpExpire =
        new Date(
            Date.now() + 10 * 60 * 1000
        );

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire =
        otpExpire;

    await user.save();

    await sendEmail({
        to: email,

        subject: "StudyGPT password reset OTP",

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>StudyGPT Password Reset</h2>

                <p>Hello ${user.name},</p>

                <p>Your password reset OTP is:</p>

                <h1>${otp}</h1>

                <p>
                    This OTP will expire in 10 minutes.
                </p>
            </div>
        `
    });
};


const verifyResetPasswordOTP = async({
    email,
    otp
}) => {
    const user = await User.findOne({ email })
        .select("+resetPasswordOTP +resetPasswordOTPExpire");

    if (!user || !user.resetPasswordOTP) {
        throw new Error("Invalid or expired reset OTP");
    }

    if (!user.resetPasswordOTPExpire ||
        user.resetPasswordOTPExpire < new Date()) {
        throw new Error("Reset OTP has expired");
    }

    if (user.resetPasswordOTP !== otp) {
        throw new Error("Invalid reset OTP");
    }

    return { email: user.email };
};


const resetPassword = async({
    email,
    otp,
    newPassword
}) => {
    const user = await User.findOne({ email })
        .select("+resetPasswordOTP +resetPasswordOTPExpire");

    if (!user) {
        throw new Error(
            "Invalid reset request"
        );
    }

    if (!user.resetPasswordOTP) {
        throw new Error(
            "Reset OTP not found"
        );
    }

    if (!user.resetPasswordOTPExpire ||
        user.resetPasswordOTPExpire <
        new Date()
    ) {
        throw new Error(
            "Reset OTP has expired"
        );
    }

    if (
        user.resetPasswordOTP !== otp
    ) {
        throw new Error(
            "Invalid reset OTP"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    user.password =
        hashedPassword;

    user.resetPasswordOTP =
        null;

    user.resetPasswordOTPExpire =
        null;

    // Invalidate old sessions
    user.refreshToken = null;

    await user.save();

    return {
        email: user.email
    };
};


const changePassword = async({
    userId,
    currentPassword,
    newPassword
}) => {
    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    const isPasswordCorrect =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new Error(
            "Current password is incorrect"
        );
    }

    const isSamePassword =
        await bcrypt.compare(
            newPassword,
            user.password
        );

    if (isSamePassword) {
        throw new Error(
            "New password must be different from current password"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    user.password =
        hashedPassword;

    // Logout all existing refresh sessions
    user.refreshToken = null;

    await user.save();

    return {
        email: user.email
    };
};


export {
    registerUser,
    verifyEmail,
    resendVerificationOTP,
    loginUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    verifyResetPasswordOTP,
    resetPassword,
    changePassword
};
