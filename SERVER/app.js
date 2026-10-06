import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import chatRoutes from "./src/routes/chat.route.js";

import errorMiddleware from "./src/middleware/error.middleware.js";


const app = express();


// ========================================
// SECURITY
// ========================================

app.use(helmet());


// ========================================
// CORS
// ========================================

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// COOKIE PARSER
// ========================================

app.use(cookieParser());


// ========================================
// LOGGER
// ========================================

app.use(morgan("dev"));


// ========================================
// HEALTH CHECK
// ========================================

app.get(
    "/api/health",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "StudyGPT server is running"
        });
    }
);


// ========================================
// AUTH ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// PROFILE ROUTES
// ========================================

app.use(
    "/api/profile",
    profileRoutes
);


// ========================================
// CHAT ROUTES
// ========================================

app.use(
    "/api/chat",
    chatRoutes
);


// ========================================
// ERROR MIDDLEWARE
// ========================================

app.use(errorMiddleware);


export default app;