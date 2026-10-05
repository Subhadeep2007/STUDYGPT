const router = express.Router();
import express from "express";

import {
    register,
    verifyEmail,
    resendVerificationOTP,
    login,
    refreshToken,
    logout,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController
} from "../controllers/auth/auth.controller.js";

import validate from "../middleware/validate.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authRateLimiter from "../middleware/rateLimit.middleware.js";

import {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from "../validators/auth.validator.js";


router.post(
    "/register",
    authRateLimiter,
    validate(registerSchema),
    register
);


router.post(
    "/verify-email",
    authRateLimiter,
    validate(verifyEmailSchema),
    verifyEmail
);


router.post(
    "/resend-verification",
    authRateLimiter,
    validate(resendVerificationSchema),
    resendVerificationOTP
);


router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    login
);


router.post(
    "/refresh-token",
    refreshToken
);


router.post(
    "/logout",
    logout
);


router.post(
    "/forgot-password",
    authRateLimiter,
    validate(forgotPasswordSchema),
    forgotPasswordController
);


router.post(
    "/reset-password",
    authRateLimiter,
    validate(resetPasswordSchema),
    resetPasswordController
);


router.post(
    "/change-password",
    authMiddleware,
    validate(changePasswordSchema),
    changePasswordController
);


export default router;