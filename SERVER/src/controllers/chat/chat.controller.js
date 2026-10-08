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


import {
    generateOpenRouterResponse
} from "../../services/ai/openrouter.service.js";


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


        if (
            req.body.attachments
        ) {

            if (
                Array.isArray(
                    req.body.attachments
                )
            ) {

                attachments =
                    req.body.attachments;
            }
        }


        // ========================================
        // CHECK CHAT
        // ========================================

        const chat =
            await Chat.findOne({

                _id: chatId,

                userId: userId,

                isDeleted: false
            });


        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Chat not found"
            });
        }


        // ========================================
        // GET PREVIOUS HISTORY
        // ========================================

        const history =
            await getConversationHistory({

                userId,

                chatId
            });


        // ========================================
        // CREATE USER MESSAGE
        // ========================================

        const userMessage =
            await createUserMessage({

                userId,

                chatId,

                content,

                attachments
            });


        // ========================================
        // AI GENERATION
        // GEMINI FIRST
        // OPENROUTER FALLBACK
        // ========================================

        let aiResult =
            null;


        let aiProvider =
            "gemini";


        let geminiError =
            null;


        let openRouterError =
            null;


        // ========================================
        // TRY GEMINI
        // ========================================

        try {

            console.log(
                "================================="
            );

            console.log(
                "TRYING GEMINI"
            );

            console.log(
                "================================="
            );


            aiResult =
                await generateAIResponse({

                    userId,

                    history,

                    message: content,

                    attachments
                });


            console.log(
                "Gemini response received"
            );


        } catch (error) {

            geminiError =
                error;


            console.error(
                "Gemini failed:"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Status:",
                error.status
            );

            console.error(
                "Code:",
                error.code
            );


            // ========================================
            // OPENROUTER FALLBACK
            // TEXT + PDF + IMAGE
            // ========================================

            try {

                console.log(
                    "================================="
                );

                console.log(
                    "TRYING OPENROUTER FALLBACK"
                );

                console.log(
                    "================================="
                );


                aiResult =
                    await generateOpenRouterResponse({

                        history,

                        message: content,

                        attachments
                    });


                aiProvider =
                    "openrouter";


                console.log(
                    "OpenRouter fallback succeeded"
                );


            } catch (error) {

                openRouterError =
                    error;


                console.error(
                    "OpenRouter failed:"
                );

                console.error(
                    "Message:",
                    error.message
                );

                console.error(
                    "Status:",
                    error.status
                );

                console.error(
                    "Code:",
                    error.code
                );
            }
        }


        // ========================================
        // BOTH AI PROVIDERS FAILED
        // ========================================

        if (!aiResult) {

            let combinedError =
                "AI response failed.";


            if (
                geminiError
            ) {

                combinedError +=
                    " Gemini: " +
                    geminiError.message;
            }


            if (
                openRouterError
            ) {

                combinedError +=
                    " OpenRouter: " +
                    openRouterError.message;
            }


            await createFailedAssistantMessage({

                userId,

                chatId,

                errorMessage: combinedError,

                model: process.env.OPENROUTER_MODEL ||
                    "openrouter/free"
            });


            const error =
                new Error(
                    combinedError
                );


            error.statusCode =
                503;


            throw error;
        }


        // ========================================
        // SAVE AI RESPONSE
        // ========================================

        const assistantMessage =
            await createAssistantMessage({

                userId,

                chatId,

                content: aiResult.text,

                model: aiResult.model ||
                    (
                        aiProvider === "gemini" ?
                        process.env.GEMINI_MODEL ||
                        "gemini-3.8-flash" :
                        process.env.OPENROUTER_MODEL ||
                        "openrouter/free"
                    ),

                status: "completed"
            });


        // ========================================
        // RESPONSE
        // ========================================

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


            // ========================================
            // GET OLD MESSAGE
            // ========================================

            const oldMessage =
                await getMessageById({

                    userId,

                    messageId
                });


            // ========================================
            // ONLY USER MESSAGE
            // ========================================

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


            // ========================================
            // GET OLD ATTACHMENTS
            // ========================================

            let oldAttachments = [];


            if (
                oldMessage.attachments &&
                Array.isArray(
                    oldMessage.attachments
                )
            ) {

                oldAttachments =
                    oldMessage.attachments;
            }


            // ========================================
            // UPDATE USER MESSAGE
            // ========================================

            const editedMessage =
                await editUserMessage({

                    userId,

                    messageId,

                    content: newContent
                });


            // ========================================
            // DELETE MESSAGES AFTER
            // ========================================

            await deleteMessagesAfter({

                userId,

                chatId,

                createdAt: oldMessage.createdAt
            });


            // ========================================
            // GET UPDATED HISTORY
            // ========================================

            const updatedHistory =
                await getConversationHistory({

                    userId,

                    chatId
                });


            // ========================================
            // REMOVE EDITED MESSAGE FROM HISTORY
            // ========================================

            const historyForAI =
                updatedHistory.filter((item) => {

                    return (
                        String(
                            item.id
                        ) !==
                        String(
                            editedMessage._id
                        )
                    );
                });


            // ========================================
            // GENERATE NEW AI RESPONSE
            // GEMINI FIRST
            // OPENROUTER FALLBACK
            // ========================================

            let aiResult =
                null;


            let aiProvider =
                "gemini";


            let geminiError =
                null;


            let openRouterError =
                null;


            // ========================================
            // TRY GEMINI
            // ========================================

            try {

                console.log(
                    "Trying Gemini for edited message..."
                );


                aiResult =
                    await generateAIResponse({

                        userId,

                        history: historyForAI,

                        message: editedMessage.content,

                        attachments: oldAttachments
                    });


                console.log(
                    "Gemini edit response received"
                );


            } catch (error) {

                geminiError =
                    error;


                console.error(
                    "Gemini edit failed:",
                    error.message
                );


                // ========================================
                // OPENROUTER FALLBACK
                // TEXT + PDF + IMAGE
                // ========================================

                try {

                    console.log(
                        "Trying OpenRouter fallback for edited message..."
                    );


                    aiResult =
                        await generateOpenRouterResponse({

                            history: historyForAI,

                            message: editedMessage.content,

                            attachments: oldAttachments
                        });


                    aiProvider =
                        "openrouter";


                    console.log(
                        "OpenRouter edit fallback succeeded"
                    );


                } catch (error) {

                    openRouterError =
                        error;


                    console.error(
                        "OpenRouter edit failed:",
                        error.message
                    );
                }
            }


            // ========================================
            // BOTH PROVIDERS FAILED
            // ========================================

            if (!aiResult) {

                let combinedError =
                    "AI response failed.";


                if (
                    geminiError
                ) {

                    combinedError +=
                        " Gemini: " +
                        geminiError.message;
                }


                if (
                    openRouterError
                ) {

                    combinedError +=
                        " OpenRouter: " +
                        openRouterError.message;
                }


                const failedAssistantMessage =
                    await createFailedAssistantMessage({

                        userId,

                        chatId,

                        errorMessage: combinedError,

                        model: process.env.OPENROUTER_MODEL ||
                            "openrouter/free"
                    });


                return res.status(200).json({

                    success: true,

                    message: "Message updated, but AI could not generate a response.",

                    data: {

                        userMessage: editedMessage,

                        assistantMessage: failedAssistantMessage
                    }
                });
            }


            // ========================================
            // SAVE NEW AI RESPONSE
            // ========================================

            const assistantMessage =
                await createAssistantMessage({

                    userId,

                    chatId,

                    content: aiResult.text,

                    model: aiResult.model ||
                        (
                            aiProvider === "gemini" ?
                            process.env.GEMINI_MODEL ||
                            "gemini-3.8-flash" :
                            process.env.OPENROUTER_MODEL ||
                            "openrouter/free"
                        ),

                    status: "completed"
                });


            // ========================================
            // RESPONSE
            // ========================================

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