import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    chatUpload
} from "../middleware/upload.middleware.js";

import {
    uploadFilesController,
    getFileController,
    getChatFilesController,
    deleteFileController
} from "../controllers/file/file.controller.js";


const router = express.Router();


// ========================================
// UPLOAD MULTIPLE FILES
// ========================================

router.post(
    "/upload",
    authMiddleware,
    chatUpload.array("files", 5),
    uploadFilesController
);


// ========================================
// GET SINGLE FILE
// ========================================

router.get(
    "/:fileId",
    authMiddleware,
    getFileController
);


// ========================================
// GET ALL FILES OF CHAT
// ========================================

router.get(
    "/chat/:chatId",
    authMiddleware,
    getChatFilesController
);


// ========================================
// DELETE FILE
// ========================================

router.delete(
    "/:fileId",
    authMiddleware,
    deleteFileController
);


export default router;