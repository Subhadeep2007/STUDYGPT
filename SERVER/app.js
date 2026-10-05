import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";

import errorMiddleware from "./src/middleware/error.middleware.js";


const app = express();


// Security
app.use(helmet());


// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);


// Body parser
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// Cookies
app.use(cookieParser());


// Logger
app.use(morgan("dev"));


// Health
app.get(
    "/api/health",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "StudyGPT server is running"
        });
    }
);


// Auth
app.use(
    "/api/auth",
    authRoutes
);


// Profile
app.use(
    "/api/profile",
    profileRoutes
);


// Error middleware
app.use(errorMiddleware);


export default app;