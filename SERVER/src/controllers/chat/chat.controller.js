import Chat from "../../models/chat.js";

import {
    createUserMessage,
    createAssistantMessage,
    createFailedAssistantMessage,
    getMessageById,
    getMessagesByChat,
    editUserMessage,
    deleteMessage,
    deleteMessagesAfter,
    getConversationHistory
} from "../../services/message/message.service.js";

import {
    generateAIResponse
} from "../../services/ai/gemini.service.js";


// ========================================
// SEND MESSAGE + AI RESPONSE
// ========================================

const sendMessageController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const chatId =
            req.body.chatId;

        const content =
            req.body.content;

        let attachments = [];

        if (req.body.attachments) {
            if (
                Array.isArray(
                    req.body.attachments
                )
            ) {
                attachments =
                    req.body.attachments;
            }
        }


        // ================================
        // CHECK CHAT
        // ================================

        const chat =
            await Chat.findOne({
                _id: chatId,
                userId,
                isDeleted: false
            });


        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }


        // ================================
        // GET PREVIOUS HISTORY
        // IMPORTANT:
        // Current message is not included yet
        // ================================

        const history =
            await getConversationHistory({
                userId,
                chatId
            });


        // ================================
        // CREATE USER MESSAGE
        // ================================

        const userMessage =
            await createUserMessage({
                userId,
                chatId,
                content,
                attachments
            });


        // ================================
        // GENERATE AI RESPONSE
        // ================================

        let aiResult;


        try {

            aiResult =
                await generateAIResponse({
                    userId,
                    history,
                    message: content,
                    attachments
                });

        } catch (error) {

            // ============================
            // SAVE FAILED AI MESSAGE
            // ============================

            await createFailedAssistantMessage({
                userId,
                chatId,

                errorMessage: error.message,

                model: process.env.GEMINI_MODEL ||
                    "gemini-3.8-flash"
            });


            throw error;
        }


        // ================================
        // SAVE AI RESPONSE
        // ================================

        const assistantMessage =
            await createAssistantMessage({
                userId,

                chatId,

                content: aiResult.text,

                model: aiResult.model,

                status: "completed"
            });


        // ================================
        // RESPONSE
        // ================================

        return res.status(200).json({
            success: true,

            message: "Message sent successfully",

            data: {
                userMessage,

                assistantMessage
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET CHAT MESSAGES
// ========================================

const getChatMessagesController =
    async(
        req,
        res,
        next
    ) => {
        try {

            const userId =
                req.user.userId;

            const chatId =
                req.params.chatId;


            const messages =
                await getMessagesByChat({
                    userId,
                    chatId
                });


            return res.status(200).json({
                success: true,

                message: "Messages fetched successfully",

                data: {
                    messages
                }
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// GET SINGLE MESSAGE
// ========================================

const getMessageController =
    async(
        req,
        res,
        next
    ) => {
        try {

            const result =
                await getMessageById({
                    userId: req.user.userId,

                    messageId: req.params.messageId
                });


            return res.status(200).json({
                success: true,

                message: "Message fetched successfully",

                data: result
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// EDIT USER MESSAGE + REGENERATE AI
// ========================================

const editMessageController =
    async(
        req,
        res,
        next
    ) => {
        try {

            const userId =
                req.user.userId;

            const messageId =
                req.params.messageId;

            const newContent =
                req.body.content;


            // ============================
            // GET OLD MESSAGE
            // ============================

            const oldMessage =
                await getMessageById({
                    userId,
                    messageId
                });


            // ============================
            // ONLY USER MESSAGE
            // ============================

            if (
                oldMessage.role !== "user"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Only user messages can be edited"
                });
            }


            const chatId =
                oldMessage.chatId;


            // ============================
            // DELETE EVERYTHING AFTER
            // OLD AI RESPONSE INCLUDED
            // ============================

            await deleteMessagesAfter({
                userId,
                chatId,

                createdAt: oldMessage.createdAt
            });


            // ============================
            // EDIT USER MESSAGE
            // ============================

            const editedMessage =
                await editUserMessage({
                    userId,

                    messageId,

                    content: newContent
                });


            // ============================
            // GET UPDATED HISTORY
            // ============================

            const updatedHistory =
                await getConversationHistory({
                    userId,
                    chatId
                });


            // ============================
            // REMOVE CURRENT EDITED MESSAGE
            // FROM HISTORY
            // ============================

            const historyForAI =
                updatedHistory.slice(
                    0,
                    updatedHistory.length - 1
                );


            // ============================
            // GENERATE NEW AI RESPONSE
            // ============================

            let aiResult;


            try {

                aiResult =
                    await generateAIResponse({
                        userId,

                        history: historyForAI,

                        message: editedMessage.content,

                        attachments: editedMessage.attachments
                    });

            } catch (error) {

                await createFailedAssistantMessage({
                    userId,
                    chatId,

                    errorMessage: error.message,

                    model: process.env.GEMINI_MODEL ||
                        "gemini-3.8-flash"
                });


                throw error;
            }


            // ============================
            // SAVE NEW AI RESPONSE
            // ============================

            const assistantMessage =
                await createAssistantMessage({
                    userId,

                    chatId,

                    content: aiResult.text,

                    model: aiResult.model,

                    status: "completed"
                });


            return res.status(200).json({
                success: true,

                message: "Message edited and AI response regenerated successfully",

                data: {
                    userMessage: editedMessage,

                    assistantMessage
                }
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// DELETE MESSAGE
// ========================================

const deleteMessageController =
    async(
        req,
        res,
        next
    ) => {
        try {

            const result =
                await deleteMessage({
                    userId: req.user.userId,

                    messageId: req.params.messageId
                });


            return res.status(200).json({
                success: true,

                message: "Message deleted successfully",

                data: result
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// EXPORT
// ========================================

export {
    sendMessageController,
    getChatMessagesController,
    getMessageController,
    editMessageController,
    deleteMessageController
};