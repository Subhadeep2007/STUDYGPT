import Joi from "joi";

const passwordRule = Joi.string()
    .min(8)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .pattern(/[^A-Za-z0-9]/)
    .required()
    .messages({
        "string.min": "Password must be at least 8 characters long",

        "string.pattern.base": "Password must contain uppercase, lowercase, number and special character",

        "any.required": "Password is required"
    });

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),

    password: passwordRule
});

const verifyEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
});

const resendVerificationSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),

    password: Joi.string()
        .required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),

    newPassword: passwordRule
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required(),

    newPassword: passwordRule
});

export {
    registerSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
};