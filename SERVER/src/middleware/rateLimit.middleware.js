import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 50,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again after 15 minutes."
    }
});

export default authRateLimiter;