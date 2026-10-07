import Message from "../../models/message.js";
import Chat from "../../models/chat.js";


// ========================================
// CHECK CHAT OWNERSHIP
// ========================================

const verifyChatOwnership = async({
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

    return chat;
};


// ========================================
// CREATE USER MESSAGE
// ========================================

const createUserMessage = async({
    userId,
    chatId,
    content,
    attachments
}) => {

    await verifyChatOwnership({
        userId,
        chatId
    });


    if (!content ||
        !content.trim()
    ) {
        if (!attachments ||
            attachments.length === 0
        ) {
            throw new Error(
                "Message content or attachment is required"
            );
        }
    }


    let messageAttachments = [];

    if (attachments) {
        if (Array.isArray(attachments)) {
            messageAttachments =
                attachments;
        }
    }


    const message =
        await Message.create({
            chatId,
            userId,

            role: "user",

            content: content ?
                content.trim() :
                "",

            attachments: messageAttachments,

            status: "sent"
        });


    if (!message) {
        throw new Error(
            "Unable to create message"
        );
    }


    await Chat.findOneAndUpdate({
        _id: chatId,
        userId,
        isDeleted: false
    }, {
        $set: {
            lastMessageAt: new Date()
        }
    });


    return message;
};


// ========================================
// CREATE ASSISTANT MESSAGE
// ========================================

const createAssistantMessage = async({
    userId,
    chatId,
    content,
    model,
    status
}) => {

    await verifyChatOwnership({
        userId,
        chatId
    });


    if (!content ||
        !content.trim()
    ) {
        throw new Error(
            "AI response cannot be empty"
        );
    }


    let messageStatus = "completed";

    if (status) {
        messageStatus =
            status;
    }


    const message =
        await Message.create({
            chatId,
            userId,

            role: "assistant",

            content: content.trim(),

            model: model || null,

            status: messageStatus
        });


    if (!message) {
        throw new Error(
            "Unable to save AI response"
        );
    }


    await Chat.findOneAndUpdate({
        _id: chatId,
        userId,
        isDeleted: false
    }, {
        $set: {
            lastMessageAt: new Date()
        }
    });


    return message;
};


// ========================================
// CREATE FAILED ASSISTANT MESSAGE
// ========================================

const createFailedAssistantMessage =
    async({
        userId,
        chatId,
        errorMessage,
        model
    }) => {

        await verifyChatOwnership({
            userId,
            chatId
        });


        const message =
            await Message.create({
                chatId,
                userId,

                role: "assistant",

                content: "",

                model: model || null,

                status: "failed",

                errorMessage: errorMessage ||
                    "AI response failed"
            });


        return message;
    };


// ========================================
// GET SINGLE MESSAGE
// ========================================

const getMessageById = async({
    userId,
    messageId
}) => {

    const message =
        await Message.findOne({
            _id: messageId,
            userId
        });


    if (!message) {
        throw new Error(
            "Message not found"
        );
    }


    return message;
};


// ========================================
// GET CHAT MESSAGES
// ========================================

const getMessagesByChat = async({
    userId,
    chatId
}) => {

    await verifyChatOwnership({
        userId,
        chatId
    });


    const messages =
        await Message.find({
            userId,
            chatId
        })
        .sort({
            createdAt: 1
        });


    return messages;
};


// ========================================
// EDIT USER MESSAGE
// ========================================

const editUserMessage = async({
    userId,
    messageId,
    content
}) => {

    if (!content ||
        !content.trim()
    ) {
        throw new Error(
            "Edited message cannot be empty"
        );
    }


    const message =
        await Message.findOne({
            _id: messageId,
            userId
        });


    if (!message) {
        throw new Error(
            "Message not found"
        );
    }


    if (
        message.role !== "user"
    ) {
        throw new Error(
            "Only user messages can be edited"
        );
    }


    const chat =
        await Chat.findOne({
            _id: message.chatId,
            userId,
            isDeleted: false
        });


    if (!chat) {
        throw new Error(
            "Chat not found"
        );
    }


    message.content =
        content.trim();

    message.isEdited = true;

    message.editedAt =
        new Date();

    message.status = "sent";

    message.errorMessage = null;


    await message.save();


    await Chat.findOneAndUpdate({
        _id: message.chatId,
        userId,
        isDeleted: false
    }, {
        $set: {
            lastMessageAt: new Date()
        }
    });


    return message;
};


// ========================================
// DELETE MESSAGE
// ========================================

const deleteMessage = async({
    userId,
    messageId
}) => {

    const message =
        await Message.findOne({
            _id: messageId,
            userId
        });


    if (!message) {
        throw new Error(
            "Message not found"
        );
    }


    await Message.deleteOne({
        _id: messageId,
        userId
    });


    return {
        id: messageId
    };
};


// ========================================
// DELETE MESSAGES AFTER A MESSAGE
// ========================================

const deleteMessagesAfter = async({
    userId,
    chatId,
    createdAt
}) => {

    await verifyChatOwnership({
        userId,
        chatId
    });


    const result =
        await Message.deleteMany({
            userId,
            chatId,

            createdAt: {
                $gt: createdAt
            }
        });


    return {
        deletedCount: result.deletedCount
    };
};


// ========================================
// GET CONVERSATION HISTORY
// ========================================

const getConversationHistory =
    async({
        userId,
        chatId
    }) => {

        await verifyChatOwnership({
            userId,
            chatId
        });


        const messages =
            await Message.find({
                userId,
                chatId,

                status: {
                    $in: [
                        "sent",
                        "completed"
                    ]
                }
            })
            .sort({
                createdAt: 1
            })
            .select(
                "role content attachments createdAt"
            );


        const history = [];


        for (
            let i = 0; i < messages.length; i++
        ) {

            const message =
                messages[i];


            history.push({
                id: message._id.toString(),

                role: message.role,

                content: message.content,

                attachments: message.attachments
            });
        }


        return history;
    };


// ========================================
// UPDATE MESSAGE STATUS
// ========================================

const updateMessageStatus = async({
    userId,
    messageId,
    status,
    errorMessage
}) => {

    const message =
        await Message.findOne({
            _id: messageId,
            userId
        });


    if (!message) {
        throw new Error(
            "Message not found"
        );
    }


    message.status =
        status;


    if (errorMessage) {
        message.errorMessage =
            errorMessage;
    } else {
        message.errorMessage =
            null;
    }


    await message.save();


    return message;
};


export {
    verifyChatOwnership,
    createUserMessage,
    createAssistantMessage,
    createFailedAssistantMessage,
    getMessageById,
    getMessagesByChat,
    editUserMessage,
    deleteMessage,
    deleteMessagesAfter,
    getConversationHistory,
    updateMessageStatus
};
