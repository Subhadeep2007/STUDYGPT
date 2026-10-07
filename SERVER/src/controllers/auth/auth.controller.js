import {
    registerUser,
    verifyEmail as verifyEmailService,
    resendVerificationOTP as resendVerificationOTPService,
    loginUser,
    refreshAccessToken,
    logoutUser,
    forgotPassword,
    verifyResetPasswordOTP,
    resetPassword,
    changePassword
} from "../../services/auth/auth.service.js";


const register = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email.",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const verifyEmail = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await verifyEmailService(
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now login.",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const resendVerificationOTP = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await resendVerificationOTPService(
                req.body.email
            );

        return res.status(200).json({
            success: true,
            message: "Verification OTP sent successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};


const login = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await loginUser(req.body);

        res.cookie(
            "refreshToken",
            result.refreshToken, {
                httpOnly: true,

                secure: process.env.NODE_ENV ===
                    "production",

                sameSite: process.env.NODE_ENV ===
                    "production" ?
                    "none" :
                    "lax",

                maxAge: 7 * 24 * 60 * 60 * 1000,

                path: "/api/auth"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",

            data: {
                user: result.user,
                accessToken: result.accessToken
            }
        });

    } catch (error) {
        next(error);
    }
};


const refreshToken = async(
    req,
    res,
    next
) => {
    try {
        const token =
            req.cookies.refreshToken;

        const result =
            await refreshAccessToken(
                token
            );

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",

            data: result
        });

    } catch (error) {
        next(error);
    }
};


const logout = async(
    req,
    res,
    next
) => {
    try {
        const token =
            req.cookies.refreshToken;

        await logoutUser(token);

        res.clearCookie(
            "refreshToken", {
                httpOnly: true,

                secure: process.env.NODE_ENV ===
                    "production",

                sameSite: process.env.NODE_ENV ===
                    "production" ?
                    "none" :
                    "lax",

                path: "/api/auth"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }
};


const forgotPasswordController = async(
    req,
    res,
    next
) => {
    try {
        await forgotPassword(
            req.body.email
        );

        return res.status(200).json({
            success: true,
            message: "If the account exists, a password reset OTP has been sent."
        });

    } catch (error) {
        next(error);
    }
};


const resetPasswordController = async(
    req,
    res,
    next
) => {
    try {
        await resetPassword(
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login again."
        });

    } catch (error) {
        next(error);
    }
};


const verifyResetPasswordOTPController = async(
    req,
    res,
    next
) => {
    try {
        await verifyResetPasswordOTP({
            email: req.body.email,
            otp: req.body.otp
        });

        return res.status(200).json({
            success: true,
            message: "Reset OTP verified successfully"
        });
    } catch (error) {
        next(error);
    }
};


const changePasswordController = async(
    req,
    res,
    next
) => {
    try {
        await changePassword({
            userId: req.user.userId,

            currentPassword: req.body.currentPassword,

            newPassword: req.body.newPassword
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        next(error);
    }
};


export {
    register,
    verifyEmail,
    resendVerificationOTP,
    login,
    refreshToken,
    logout,
    forgotPasswordController,
    verifyResetPasswordOTPController,
    resetPasswordController,
    changePasswordController
};
