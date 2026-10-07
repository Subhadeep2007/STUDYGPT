import api from "./api.js";


// ========================================
// REGISTER
// ========================================

const registerUser = async({
    name,
    email,
    password
}) => {

    const response =
        await api.post(
            "/api/auth/register", {
                name,
                email,
                password
            }
        );

    return response.data;
};


// ========================================
// VERIFY EMAIL
// ========================================

const verifyEmail = async({
    email,
    otp
}) => {

    const response =
        await api.post(
            "/api/auth/verify-email", {
                email,
                otp
            }
        );

    return response.data;
};


// ========================================
// RESEND VERIFICATION OTP
// ========================================

const resendVerificationOTP = async(
    email
) => {

    const response =
        await api.post(
            "/api/auth/resend-verification", {
                email
            }
        );

    return response.data;
};


// ========================================
// LOGIN
// ========================================

const loginUser = async({
    email,
    password
}) => {

    const response =
        await api.post(
            "/api/auth/login", {
                email,
                password
            }
        );

    return response.data;
};


// ========================================
// REFRESH SESSION
// ========================================

const refreshAuthSession = async() => {

    const response =
        await api.post(
            "/api/auth/refresh-token"
        );

    return response.data;
};


// ========================================
// LOGOUT
// ========================================

const logoutUser = async() => {

    const response =
        await api.post(
            "/api/auth/logout"
        );

    return response.data;
};


// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPassword = async(
    email
) => {

    const response =
        await api.post(
            "/api/auth/forgot-password", {
                email
            }
        );

    return response.data;
};


// ========================================
// RESET PASSWORD
// ========================================

const resetPassword = async({
    email,
    otp,
    newPassword
}) => {

    const response =
        await api.post(
            "/api/auth/reset-password", {
                email,
                otp,
                newPassword
            }
        );

    return response.data;
};


// ========================================
// CHANGE PASSWORD
// ========================================

const changePassword = async({
    currentPassword,
    newPassword
}) => {

    const response =
        await api.patch(
            "/api/auth/change-password", {
                currentPassword,
                newPassword
            }
        );

    return response.data;
};


export {
    registerUser,
    verifyEmail,
    resendVerificationOTP,
    loginUser,
    refreshAuthSession,
    logoutUser,
    forgotPassword,
    resetPassword,
    changePassword
};