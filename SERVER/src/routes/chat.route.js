import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import authRateLimiter from "../middleware/rateLimit.middleware.js";

import {
    sendMessageController,
    getChatMessagesController,
    getMessageController,
    editMessageController,
    deleteMessageController
} from "../controllers/chat/chat.controller.js";

import {
    createChatController,
    getUserChatsController,
    getChatController,
    getChatWithMessagesController,
    renameChatController,
    deleteChatController,
    permanentlyDeleteChatController
} from "../controllers/chat/chatList.controller.js";


const router = express.Router();


// ========================================
// CHAT MANAGEMENT
// ========================================


// CREATE NEW CHAT
router.post(
    "/",
    authMiddleware,
    createChatController
);


// GET ALL USER CHATS
router.get(
    "/",
    authMiddleware,
    getUserChatsController
);


// GET FULL CHAT + MESSAGES
router.get(
    "/:chatId/full",
    authMiddleware,
    getChatWithMessagesController
);


// GET SINGLE CHAT
router.get(
    "/:chatId",
    authMiddleware,
    getChatController
);


// RENAME CHAT
router.patch(
    "/:chatId",
    authMiddleware,
    renameChatController
);


// SOFT DELETE CHAT
router.delete(
    "/:chatId",
    authMiddleware,
    deleteChatController
);


// PERMANENT DELETE CHAT
router.delete(
    "/:chatId/permanent",
    authMiddleware,
    permanentlyDeleteChatController
);


// ========================================
// MESSAGE
// ========================================


// SEND MESSAGE + GEMINI RESPONSE
router.post(
    "/message",
    authMiddleware,
    authRateLimiter,
    sendMessageController
);


// GET SINGLE MESSAGE
router.get(
    "/message/:messageId",
    authMiddleware,
    getMessageController
);


// EDIT MESSAGE + REGENERATE AI
router.patch(
    "/message/:messageId",
    authMiddleware,
    authRateLimiter,
    editMessageController
);


// DELETE MESSAGE
router.delete(
    "/message/:messageId",
    authMiddleware,
    deleteMessageController
);


// GET ALL MESSAGES OF CHAT
router.get(
    "/:chatId/messages",
    authMiddleware,
    getChatMessagesController
);


export default router;