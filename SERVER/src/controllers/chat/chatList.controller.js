import {
    createChat,
    getUserChats,
    getChatById,
    getChatWithMessages,
    renameChat,
    deleteChat,
    permanentlyDeleteChat
} from "../../services/chat/chat.service.js";


// ========================================
// CREATE NEW CHAT
// ========================================

const createChatController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const title =
            req.body.title;


        const result =
            await createChat({
                userId,
                title
            });


        return res.status(201).json({
            success: true,

            message: "New chat created successfully",

            data: {
                chat: result
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET ALL USER CHATS
// ========================================

const getUserChatsController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;


        const chats =
            await getUserChats(
                userId
            );


        return res.status(200).json({
            success: true,

            message: "Chats fetched successfully",

            data: {
                chats
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET SINGLE CHAT
// ========================================

const getChatController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const chatId =
            req.params.chatId;


        const chat =
            await getChatById({
                userId,
                chatId
            });


        return res.status(200).json({
            success: true,

            message: "Chat fetched successfully",

            data: {
                chat
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET CHAT + ALL MESSAGES
// ========================================

const getChatWithMessagesController =
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


            const result =
                await getChatWithMessages({
                    userId,
                    chatId
                });


            return res.status(200).json({
                success: true,

                message: "Chat and messages fetched successfully",

                data: result
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// RENAME CHAT
// ========================================

const renameChatController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const chatId =
            req.params.chatId;

        const title =
            req.body.title;


        const result =
            await renameChat({
                userId,
                chatId,
                title
            });


        return res.status(200).json({
            success: true,

            message: "Chat renamed successfully",

            data: {
                chat: result
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// DELETE CHAT
// ========================================

const deleteChatController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const chatId =
            req.params.chatId;


        const result =
            await deleteChat({
                userId,
                chatId
            });


        return res.status(200).json({
            success: true,

            message: "Chat deleted successfully",

            data: result
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// PERMANENTLY DELETE CHAT
// ========================================

const permanentlyDeleteChatController =
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


            const result =
                await permanentlyDeleteChat({
                    userId,
                    chatId
                });


            return res.status(200).json({
                success: true,

                message: "Chat permanently deleted",

                data: result
            });

        } catch (error) {
            next(error);
        }
    };


export {
    createChatController,
    getUserChatsController,
    getChatController,
    getChatWithMessagesController,
    renameChatController,
    deleteChatController,
    permanentlyDeleteChatController
};