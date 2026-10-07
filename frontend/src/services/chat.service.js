import api from "./api.js";


// ========================================
// CREATE NEW CHAT
// ========================================

const createChat = async(title) => {

    const response =
        await api.post(
            "/api/chat", {
                title: title || ""
            }
        );

    return response.data;
};


// ========================================
// GET ALL CHATS
// ========================================

const getUserChats = async() => {

    const response =
        await api.get(
            "/api/chat"
        );

    return response.data;
};


// ========================================
// GET SINGLE CHAT
// ========================================

const getChat = async(
    chatId
) => {

    const response =
        await api.get(
            `/api/chat/${chatId}`
        );

    return response.data;
};


// ========================================
// GET FULL CHAT
// CHAT + MESSAGES
// ========================================

const getChatWithMessages = async(
    chatId
) => {

    const response =
        await api.get(
            `/api/chat/${chatId}/full`
        );

    return response.data;
};


// ========================================
// RENAME CHAT
// ========================================

const renameChat = async(
    chatId,
    title
) => {

    const response =
        await api.patch(
            `/api/chat/${chatId}`, {
                title
            }
        );

    return response.data;
};


// ========================================
// DELETE CHAT
// ========================================

const deleteChat = async(
    chatId
) => {

    const response =
        await api.delete(
            `/api/chat/${chatId}`
        );

    return response.data;
};


// ========================================
// PERMANENTLY DELETE CHAT
// ========================================

const permanentlyDeleteChat = async(
    chatId
) => {

    const response =
        await api.delete(
            `/api/chat/${chatId}/permanent`
        );

    return response.data;
};


// ========================================
// GET CHAT MESSAGES
// ========================================

const getChatMessages = async(
    chatId
) => {

    const response =
        await api.get(
            `/api/chat/${chatId}/messages`
        );

    return response.data;
};


// ========================================
// SEND MESSAGE
// ========================================

const sendMessage = async({
    chatId,
    content,
    attachments
}) => {

    let messageAttachments = [];

    if (attachments) {
        if (
            Array.isArray(
                attachments
            )
        ) {
            messageAttachments =
                attachments;
        }
    }


    const response =
        await api.post(
            "/api/chat/message", {
                chatId,

                content: content || "",

                attachments: messageAttachments
            }
        );

    return response.data;
};


// ========================================
// GET SINGLE MESSAGE
// ========================================

const getMessage = async(
    messageId
) => {

    const response =
        await api.get(
            `/api/chat/message/${messageId}`
        );

    return response.data;
};


// ========================================
// EDIT MESSAGE
// ========================================

const editMessage = async(
    messageId,
    content
) => {

    const response =
        await api.patch(
            `/api/chat/message/${messageId}`, {
                content
            }
        );

    return response.data;
};


// ========================================
// DELETE MESSAGE
// ========================================

const deleteMessage = async(
    messageId
) => {

    const response =
        await api.delete(
            `/api/chat/message/${messageId}`
        );

    return response.data;
};


// ========================================
// EXPORT
// ========================================

export {
    createChat,
    getUserChats,
    getChat,
    getChatWithMessages,
    renameChat,
    deleteChat,
    permanentlyDeleteChat,
    getChatMessages,
    sendMessage,
    getMessage,
    editMessage,
    deleteMessage
};
