import Joi from "joi";

const updateUsernameSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[A-Za-z0-9_ ]+$/)
        .required()
        .messages({
            "string.min": "Username must be at least 2 characters long",

            "string.max": "Username cannot exceed 50 characters",

            "string.pattern.base": "Username can contain letters, numbers, spaces and underscore only",

            "any.required": "Username is required"
        })
});

export {
    updateUsernameSchema
};