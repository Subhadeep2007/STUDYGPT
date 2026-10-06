import Chat from "../../models/chat.js";
import Message from "../../models/message.js";


// ========================================
// CREATE NEW CHAT
// ========================================

const createChat = async({
    userId,
    title
}) => {

    let chatTitle = "New Chat";

    if (title && title.trim()) {
        chatTitle = title.trim();
    }


    const chat = await Chat.create({
        userId,
        title: chatTitle,
        lastMessageAt: null,
        isDeleted: false
    });


    if (!chat) {
        throw new Error(
            "Unable to create chat"
        );
    }


    return {
        id: chat._id,
        title: chat.title,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
    };
};


// ========================================
// GET ALL USER CHATS
// ========================================

const getUserChats = async(
    userId
) => {

    const chats = await Chat.find({
            userId,
            isDeleted: false
        })
        .sort({
            updatedAt: -1
        })
        .select(
            "_id title lastMessageAt createdAt updatedAt"
        );


    return chats;
};


// ========================================
// GET SINGLE CHAT
// ========================================

const getChatById = async({
    userId,
    chatId
}) => {

    const chat = await Chat.findOne({
            _id: chatId,
            userId,
            isDeleted: false
        })
        .select(
            "_id title lastMessageAt createdAt updatedAt"
        );


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    return chat;
};


// ========================================
// GET CHAT MESSAGES
// ========================================

const getChatMessages = async({
    userId,
    chatId
}) => {

    const chat = await Chat.findOne({
            _id: chatId,
            userId,
            isDeleted: false
        })
        .select("_id");


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    const messages =
        await Message.find({
            chatId,
            userId
        })
        .sort({
            createdAt: 1
        });


    return messages;
};


// ========================================
// GET CHAT WITH MESSAGES
// ========================================

const getChatWithMessages = async({
    userId,
    chatId
}) => {

    const chat = await Chat.findOne({
        _id: chatId,
        userId,
        isDeleted: false
    });


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    const messages =
        await Message.find({
            chatId,
            userId
        })
        .sort({
            createdAt: 1
        });


    return {
        chat: {
            id: chat._id,
            title: chat.title,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        },

        messages
    };
};


// ========================================
// RENAME CHAT
// ========================================

const renameChat = async({
    userId,
    chatId,
    title
}) => {

    if (!title || !title.trim()) {
        throw new Error(
            "Chat title is required"
        );
    }


    const newTitle =
        title.trim();


    const chat =
        await Chat.findOne({
            _id: chatId,
            userId,
            isDeleted: false
        });


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    chat.title =
        newTitle;


    await chat.save();


    return {
        id: chat._id,
        title: chat.title,
        updatedAt: chat.updatedAt
    };
};


// ========================================
// UPDATE LAST MESSAGE TIME
// ========================================

const updateLastMessageTime =
    async({
        userId,
        chatId
    }) => {

        const chat =
            await Chat.findOne({
                _id: chatId,
                userId,
                isDeleted: false
            });


        if (!chat) {
            throw new Error(
                "Chat not found"
            );
        }


        chat.lastMessageAt =
            new Date();


        await chat.save();


        return chat;
    };


// ========================================
// DELETE CHAT
// ========================================

const deleteChat = async({
    userId,
    chatId
}) => {

    const chat =
        await Chat.findOne({
            _id: chatId,
            userId,
            isDeleted: false
        });


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    // Soft delete chat
    chat.isDeleted = true;

    await chat.save();


    return {
        id: chat._id
    };
};


// ========================================
// DELETE CHAT PERMANENTLY
// ========================================

const permanentlyDeleteChat =
    async({
        userId,
        chatId
    }) => {

        const chat =
            await Chat.findOne({
                _id: chatId,
                userId
            });


        if (!chat) {
            throw new Error(
                "Chat not found"
            );
        }


        await Message.deleteMany({
            chatId,
            userId
        });


        await Chat.deleteOne({
            _id: chatId,
            userId
        });


        return {
            id: chatId
        };
    };


export {
    createChat,
    getUserChats,
    getChatById,
    getChatMessages,
    getChatWithMessages,
    renameChat,
    updateLastMessageTime,
    deleteChat,
    permanentlyDeleteChat
};