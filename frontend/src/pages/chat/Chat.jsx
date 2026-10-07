import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Menu,
    MessageSquare,
    Plus,
    PanelLeftClose,
    PanelLeftOpen,
    UserCircle2,
    X
} from "lucide-react";
import { toast } from "sonner";

import MessageBubble from "../../components/chat/MessageBubble.jsx";
import ChatComposer from "../../components/chat/ChatComposer.jsx";

import {
    createChat,
    getUserChats,
    getChatWithMessages,
    sendMessage,
    renameChat,
    deleteChat
} from "../../services/chat.service.js";

import { useAuth } from "../../context/AuthContext.jsx";

const Chat = () => {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const { user } = useAuth();

    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);

    const [currentChat, setCurrentChat] = useState(null);

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const loadChats = async () => {
        try {
            setLoadingChats(true);

            const response = await getUserChats();

            if (
                response &&
                response.data &&
                Array.isArray(response.data.chats)
            ) {
                setChats(response.data.chats);
            } else {
                setChats([]);
            }
        } catch (error) {
            console.error("Load chats error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to load chats"
            );
        } finally {
            setLoadingChats(false);
        }
    };

    const loadCurrentChat = async (id) => {
        if (!id) {
            setCurrentChat(null);
            setMessages([]);
            return;
        }

        try {
            setLoadingMessages(true);

            const response = await getChatWithMessages(id);

            if (
                !response ||
                !response.data ||
                !response.data.chat
            ) {
                throw new Error("Invalid chat response");
            }

            setCurrentChat(response.data.chat);

            if (Array.isArray(response.data.messages)) {
                setMessages(response.data.messages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Load chat error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to load chat"
            );

            navigate("/chat");
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (chatId) {
            loadCurrentChat(chatId);
        } else {
            setCurrentChat(null);
            setMessages([]);
        }
    }, [chatId]);

    const getChatId = (chat) => {
        if (!chat) {
            return "";
        }

        if (chat._id) {
            return String(chat._id);
        }

        if (chat.id) {
            return String(chat.id);
        }

        return "";
    };

    const handleNewChat = async () => {
        try {
            const response = await createChat();

            if (
                !response ||
                !response.data ||
                !response.data.chat
            ) {
                throw new Error("Failed to create chat");
            }

            const newChat = response.data.chat;
            const newChatId = getChatId(newChat);

            if (!newChatId) {
                throw new Error("Chat ID not received");
            }

            setChats((previousChats) => {
                return [newChat, ...previousChats];
            });

            setCurrentChat(newChat);
            setMessages([]);

            setMobileSidebarOpen(false);

            navigate(`/chat/${newChatId}`);
        } catch (error) {
            console.error("Create chat error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Could not create new chat"
            );
        }
    };

    const refreshChatList = async () => {
        try {
            const response = await getUserChats();

            if (
                response &&
                response.data &&
                Array.isArray(response.data.chats)
            ) {
                setChats(response.data.chats);
            }
        } catch (error) {
            console.error("Refresh chat list error:", error);
        }
    };

    const handleSendMessage = async (messagePayload) => {
        if (!chatId) {
            toast.error("Please create a chat first");
            return;
        }

        try {
            setSendingMessage(true);

            // User message ko turant screen par dikhao.
            // Server ka AI response baad mein aayega.
            const temporaryMessageId = `temporary-${Date.now()}`;
            const temporaryMessage = {
                _id: temporaryMessageId,
                role: "user",
                content: messagePayload.content || "",
                attachments: messagePayload.attachments || [],
                status: "sent",
                createdAt: new Date().toISOString()
            };

            setMessages((previousMessages) => {
                return [...previousMessages, temporaryMessage];
            });

            const response = await sendMessage({
                chatId: chatId,
                content: messagePayload.content || "",
                attachments: messagePayload.attachments || []
            });

            if (
                !response ||
                !response.data
            ) {
                throw new Error("Invalid message response");
            }

            const data = response.data;

            // Temporary message ko database se aaye asli message se badlo.
            setMessages((previousMessages) => {
                return previousMessages.filter((message) => {
                    return message._id !== temporaryMessageId;
                });
            });

            if (data.userMessage) {
                setMessages((previousMessages) => {
                    return [
                        ...previousMessages,
                        data.userMessage
                    ];
                });
            }

            if (data.assistantMessage) {
                setMessages((previousMessages) => {
                    return [
                        ...previousMessages,
                        data.assistantMessage
                    ];
                });
            }

            await refreshChatList();

            if (
                !messagePayload.content &&
                messagePayload.attachments &&
                messagePayload.attachments.length > 0
            ) {
                toast.success("Files uploaded successfully");
            }

            window.setTimeout(() => {
                const messageContainer =
                    document.getElementById("chat-messages");

                if (messageContainer) {
                    messageContainer.scrollTo({
                        top: messageContainer.scrollHeight,
                        behavior: "smooth"
                    });
                }
            }, 100);
        } catch (error) {
            console.error("Send message error:", error);

            // Server user message save kar chuka ho sakta hai,
            // isliye chat dobara load karke usse screen par dikhao.
            await loadCurrentChat(chatId);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to send message"
            );
        } finally {
            setSendingMessage(false);
        }
    };

    const handleMessageUpdated = (data) => {
        if (!data) {
            return;
        }

        if (
            data.userMessage &&
            data.assistantMessage
        ) {
            setMessages((previousMessages) => {
                return previousMessages.map((message) => {
                    const messageId = message._id || message.id;
                    const updatedUserId =
                        data.userMessage._id || data.userMessage.id;
                    const updatedAssistantId =
                        data.assistantMessage._id ||
                        data.assistantMessage.id;

                    if (messageId === updatedUserId) {
                        return data.userMessage;
                    }

                    if (messageId === updatedAssistantId) {
                        return data.assistantMessage;
                    }

                    return message;
                });
            });

            refreshChatList();
            return;
        }

        loadCurrentChat(chatId);
    };

    const handleMessageDeleted = (messageId) => {
        if (!messageId) {
            return;
        }

        setMessages((previousMessages) => {
            return previousMessages.filter((message) => {
                const currentMessageId =
                    message._id || message.id;

                return currentMessageId !== messageId;
            });
        });

        refreshChatList();
    };

    const handleDeleteChat = async (id) => {
        if (!id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this chat?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteChat(id);

            setChats((previousChats) => {
                return previousChats.filter((chat) => {
                    return getChatId(chat) !== id;
                });
            });

            if (chatId === id) {
                navigate("/chat");
            }

            toast.success("Chat deleted");
        } catch (error) {
            console.error("Delete chat error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to delete chat"
            );
        }
    };

    const handleRenameChat = async (id, currentTitle) => {
        if (!id) {
            return;
        }

        const newTitle = window.prompt(
            "Enter new chat title",
            currentTitle || "New Chat"
        );

        if (!newTitle) {
            return;
        }

        const trimmedTitle = newTitle.trim();

        if (!trimmedTitle) {
            return;
        }

        try {
            const response = await renameChat(
                id,
                trimmedTitle
            );

            if (
                response &&
                response.data &&
                response.data.chat
            ) {
                const updatedChat = response.data.chat;

                setChats((previousChats) => {
                    return previousChats.map((chat) => {
                        if (getChatId(chat) === id) {
                            return updatedChat;
                        }

                        return chat;
                    });
                });

                if (
                    currentChat &&
                    getChatId(currentChat) === id
                ) {
                    setCurrentChat(updatedChat);
                }
            }

            toast.success("Chat renamed");
        } catch (error) {
            console.error("Rename chat error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to rename chat"
            );
        }
    };

    const renderEmptyState = () => {
        return (
            <div className="flex min-h-full flex-1 items-center justify-center px-4">
                <div className="w-full max-w-2xl text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                        <MessageSquare
                            size={30}
                            className="text-slate-700 dark:text-slate-200"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                        Welcome to StudyGPT
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                        Ask questions, explain difficult topics,
                        summarize notes, solve study problems,
                        or upload your PDF, image or document.
                    </p>

                    <button
                        type="button"
                        onClick={handleNewChat}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                        <Plus size={18} />
                        Start New Chat
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">

            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col border-r
                    border-slate-200 bg-white transition-all duration-300
                    dark:border-slate-800 dark:bg-slate-900
                    md:relative md:z-20
                    ${sidebarOpen ? "md:w-72" : "md:w-[72px]"}
                    ${mobileSidebarOpen
                        ? "w-[290px] translate-x-0"
                        : "w-[290px] -translate-x-full md:translate-x-0"
                    }
                `}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-3 dark:border-slate-800">
                    <div
                        className={`
                            flex items-center gap-3 overflow-hidden
                            ${sidebarOpen || mobileSidebarOpen
                                ? "opacity-100"
                                : "md:w-0 md:opacity-0"
                            }
                        `}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                            S
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                StudyGPT
                            </p>

                            <p className="truncate text-[11px] text-slate-400">
                                AI Study Assistant
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 md:block dark:hover:bg-slate-800"
                        title={
                            sidebarOpen
                                ? "Collapse sidebar"
                                : "Expand sidebar"
                        }
                    >
                        {sidebarOpen ? (
                            <PanelLeftClose size={19} />
                        ) : (
                            <PanelLeftOpen size={19} />
                        )}
                    </button>
                </div>

                {/* New Chat */}
                <div className="p-3">
                    <button
                        type="button"
                        onClick={handleNewChat}
                        className={`
                            flex w-full items-center justify-center gap-2 rounded-xl
                            border border-slate-200 bg-white px-3 py-2.5
                            text-sm font-semibold text-slate-800 transition
                            hover:bg-slate-100
                            dark:border-slate-700 dark:bg-slate-800
                            dark:text-white dark:hover:bg-slate-700
                        `}
                    >
                        <Plus size={18} />

                        {(sidebarOpen || mobileSidebarOpen) && (
                            <span>New Chat</span>
                        )}
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-2 pb-3">
                    {(sidebarOpen || mobileSidebarOpen) && (
                        <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Recent Chats
                        </p>
                    )}

                    {loadingChats ? (
                        <div className="space-y-2 px-2">
                            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                        </div>
                    ) : chats.length === 0 ? (
                        <div
                            className={`
                                px-2 py-8 text-center text-xs
                                text-slate-400
                                ${sidebarOpen || mobileSidebarOpen
                                    ? "block"
                                    : "hidden"
                                }
                            `}
                        >
                            No chats yet
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {chats.map((chat) => {
                                const id = getChatId(chat);
                                const active = id === chatId;

                                return (
                                    <div
                                        key={id}
                                        className="group relative"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(`/chat/${id}`);
                                                setMobileSidebarOpen(false);
                                            }}
                                            className={`
                                                flex w-full items-center gap-3 rounded-xl
                                                px-3 py-2.5 text-left transition
                                                ${active
                                                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/70"
                                                }
                                            `}
                                        >
                                            <MessageSquare
                                                size={17}
                                                className="shrink-0"
                                            />

                                            {(sidebarOpen || mobileSidebarOpen) && (
                                                <div className="min-w-0 flex-1 pr-12">
                                                    <p className="truncate text-sm font-medium">
                                                        {chat.title ||
                                                            "New Chat"}
                                                    </p>
                                                </div>
                                            )}
                                        </button>

                                        {(sidebarOpen || mobileSidebarOpen) && (
                                            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 gap-1 group-hover:flex">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRenameChat(
                                                            id,
                                                            chat.title
                                                        )
                                                    }
                                                    className="rounded-lg bg-white px-2 py-1 text-[10px] font-medium text-slate-500 shadow-sm hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:text-white"
                                                >
                                                    Rename
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteChat(id)
                                                    }
                                                    className="rounded-lg bg-white px-2 py-1 text-[10px] font-medium text-red-500 shadow-sm hover:bg-red-50 dark:bg-slate-700 dark:hover:bg-red-950"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/profile");
                            setMobileSidebarOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <UserCircle2
                            size={25}
                            className="shrink-0 text-slate-500"
                        />

                        {(sidebarOpen || mobileSidebarOpen) && (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                    {user && user.name
                                        ? user.name
                                        : "My Profile"}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    Profile & Settings
                                </p>
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex min-w-0 flex-1 flex-col">

                {/* Top Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5">
                    <div className="flex min-w-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileSidebarOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                                {currentChat
                                    ? currentChat.title || "Study Chat"
                                    : "StudyGPT"}
                            </h1>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Profile"
                    >
                        <UserCircle2 size={22} />
                    </button>
                </header>

                {/* Messages */}
                <div
                    id="chat-messages"
                    className="flex-1 overflow-y-auto"
                >
                    {!chatId ? (
                        renderEmptyState()
                    ) : loadingMessages ? (
                        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-3 py-6 sm:px-5">
                            <div className="ml-auto h-16 w-4/5 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                            <div className="h-20 w-4/5 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                            <div className="ml-auto h-16 w-3/5 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex min-h-full items-center justify-center px-4">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                                    <MessageSquare
                                        size={26}
                                        className="text-slate-600 dark:text-slate-300"
                                    />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                    Start studying
                                </h2>

                                <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                                    Ask a question or upload your study files.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-4xl px-3 py-5 sm:px-5 sm:py-7">
                            <div className="space-y-5">
                                {messages.map((message) => {
                                    const messageId =
                                        message._id || message.id;

                                    return (
                                        <MessageBubble
                                            key={messageId}
                                            message={message}
                                            onMessageUpdated={
                                                handleMessageUpdated
                                            }
                                            onMessageDeleted={
                                                handleMessageDeleted
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {sendingMessage && (
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                                        S
                                    </div>

                                    <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Composer */}
                {chatId && (
                    <div className="shrink-0 border-t border-slate-200 bg-white px-3 pb-3 pt-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5 sm:pb-5">
                        <div className="mx-auto w-full max-w-4xl">
                            <ChatComposer
                                chatId={chatId}
                                onMessageSent={handleSendMessage}
                                disabled={sendingMessage}
                            />

                            <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
                                StudyGPT can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chat;
