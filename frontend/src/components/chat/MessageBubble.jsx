
import {
    useState
} from "react";

import {
    Check,
    Copy,
    Edit3,
    LoaderCircle,
    Trash2,
    FileText,
    Image as ImageIcon,
    UserRound,
    X
} from "lucide-react";

import {
    toast
} from "sonner";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    editMessage,
    deleteMessage
} from "../../services/chat.service.js";


// ========================================
// MARKDOWN MESSAGE
// ========================================

const MarkdownMessage = ({
    content
}) => {

    let messageContent = "";

    if (content) {
        messageContent = content;
    }


    return (
        <div className="markdown-content text-sm leading-7">

            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm
                ]}
                components={{

                    p: ({
                        children
                    }) => {
                        return (
                            <p className="mb-3 last:mb-0">
                                {children}
                            </p>
                        );
                    },


                    h1: ({
                        children
                    }) => {
                        return (
                            <h1 className="mt-5 mb-4 text-xl font-bold first:mt-0">
                                {children}
                            </h1>
                        );
                    },


                    h2: ({
                        children
                    }) => {
                        return (
                            <h2 className="mt-5 mb-3 text-lg font-bold first:mt-0">
                                {children}
                            </h2>
                        );
                    },


                    h3: ({
                        children
                    }) => {
                        return (
                            <h3 className="mt-4 mb-2 text-base font-bold first:mt-0">
                                {children}
                            </h3>
                        );
                    },


                    ul: ({
                        children
                    }) => {
                        return (
                            <ul className="mb-3 list-disc space-y-1 pl-6">
                                {children}
                            </ul>
                        );
                    },


                    ol: ({
                        children
                    }) => {
                        return (
                            <ol className="mb-3 list-decimal space-y-1 pl-6">
                                {children}
                            </ol>
                        );
                    },


                    li: ({
                        children
                    }) => {
                        return (
                            <li className="pl-1">
                                {children}
                            </li>
                        );
                    },


                    code: ({
                        inline,
                        className,
                        children
                    }) => {

                        if (inline) {
                            return (
                                <code className="rounded-md bg-slate-200 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
                                    {children}
                                </code>
                            );
                        }


                        let codeClass =
                            "font-mono";


                        if (className) {
                            codeClass =
                                className;
                        }


                        return (
                            <code
                                className={
                                    codeClass
                                }
                            >
                                {children}
                            </code>
                        );
                    },


                    pre: ({
                        children
                    }) => {
                        return (
                            <pre className="my-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                                {children}
                            </pre>
                        );
                    },


                    blockquote: ({
                        children
                    }) => {
                        return (
                            <blockquote className="my-4 border-l-4 border-slate-300 pl-4 italic text-slate-500">
                                {children}
                            </blockquote>
                        );
                    },


                    a: ({
                        href,
                        children
                    }) => {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                            >
                                {children}
                            </a>
                        );
                    },


                    hr: () => {
                        return (
                            <hr className="my-5 border-slate-200" />
                        );
                    },


                    table: ({
                        children
                    }) => {
                        return (
                            <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full min-w-[500px] border-collapse text-sm">
                                    {children}
                                </table>
                            </div>
                        );
                    },


                    thead: ({
                        children
                    }) => {
                        return (
                            <thead className="bg-slate-100">
                                {children}
                            </thead>
                        );
                    },


                    tbody: ({
                        children
                    }) => {
                        return (
                            <tbody>
                                {children}
                            </tbody>
                        );
                    },


                    tr: ({
                        children
                    }) => {
                        return (
                            <tr className="border-b border-slate-200 last:border-b-0">
                                {children}
                            </tr>
                        );
                    },


                    th: ({
                        children
                    }) => {
                        return (
                            <th className="px-3 py-2 text-left font-semibold text-slate-700">
                                {children}
                            </th>
                        );
                    },


                    td: ({
                        children
                    }) => {
                        return (
                            <td className="px-3 py-2 text-slate-600">
                                {children}
                            </td>
                        );
                    },


                    strong: ({
                        children
                    }) => {
                        return (
                            <strong className="font-semibold">
                                {children}
                            </strong>
                        );
                    }
                }}
            >
                {messageContent}
            </ReactMarkdown>

        </div>
    );
};


// ========================================
// MESSAGE BUBBLE
// ========================================

const MessageBubble = ({
    message,
    user,
    displayName,
    onMessageUpdated,
    onMessageDeleted
}) => {

    const isUser =
        message.role === "user";


    const [editing, setEditing] =
        useState(false);

    const [editContent, setEditContent] =
        useState(
            message.content || ""
        );

    const [savingEdit, setSavingEdit] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [copied, setCopied] =
        useState(false);


    // ========================================
    // COPY MESSAGE
    // ========================================

    const handleCopy = async () => {

        try {

            await navigator.clipboard.writeText(
                message.content || ""
            );


            setCopied(true);

            toast.success(
                "Response copied"
            );


            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch (error) {

            toast.error(
                "Unable to copy response"
            );
        }
    };


    // ========================================
    // START EDIT
    // ========================================

    const handleStartEdit = () => {

        setEditContent(
            message.content || ""
        );

        setEditing(true);
    };


    // ========================================
    // CANCEL EDIT
    // ========================================

    const handleCancelEdit = () => {

        setEditContent(
            message.content || ""
        );

        setEditing(false);
    };


    // ========================================
    // SAVE EDIT
    // ========================================

    const handleSaveEdit = async () => {

        const trimmedContent =
            editContent.trim();


        if (!trimmedContent) {

            toast.error(
                "Message cannot be empty"
            );

            return;
        }


        if (
            trimmedContent ===
            (message.content || "").trim()
        ) {

            setEditing(false);

            return;
        }


        try {

            setSavingEdit(true);

            setEditing(false);

            if (onMessageUpdated) {
                const messageId = message._id || message.id;

                onMessageUpdated({
                    pending: true,
                    userMessage: {
                        ...message,
                        content: trimmedContent,
                        isEdited: true
                    },
                    assistantMessage: {
                        _id: `pending-edit-${messageId}`,
                        role: "assistant",
                        content: "",
                        status: "processing",
                        createdAt: new Date().toISOString()
                    }
                });
            }


            const result =
                await editMessage(
                    message._id ||
                    message.id,

                    trimmedContent
                );


            if (
                !result ||
                !result.success
            ) {
                throw new Error(
                    "Unable to edit message"
                );
            }


            if (result.data?.assistantMessage?.status === "failed") {
                toast.warning("Message saved, but AI could not generate a response.");
            } else {
                toast.success("Message updated and response regenerated");
            }


            if (onMessageUpdated) {

                onMessageUpdated(
                    result.data
                );
            }

        } catch (error) {

            setEditing(true);

            if (onMessageUpdated) {
                onMessageUpdated({ reload: true });
            }

            let errorMessage =
                "Unable to edit message";


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                errorMessage =
                    error.response.data.message;
            }


            toast.error(
                errorMessage
            );

        } finally {

            setSavingEdit(false);
        }
    };


    // ========================================
    // DELETE MESSAGE
    // ========================================

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Delete this message?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeleting(true);


            const result =
                await deleteMessage(
                    message._id ||
                    message.id
                );


            if (
                !result ||
                !result.success
            ) {
                throw new Error(
                    "Unable to delete message"
                );
            }


            toast.success(
                "Message deleted"
            );


            if (onMessageDeleted) {

                onMessageDeleted(
                    message._id ||
                    message.id
                );
            }

        } catch (error) {

            let errorMessage =
                "Unable to delete message";


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                errorMessage =
                    error.response.data.message;
            }


            toast.error(
                errorMessage
            );

        } finally {

            setDeleting(false);
        }
    };


    // ========================================
    // USER MESSAGE
    // ========================================

    if (isUser) {

        return (
            <div className="flex justify-end gap-3">

                <div className="flex max-w-[90%] flex-col items-end sm:max-w-[80%]">

                    {editing ? (

                        <div className="w-full min-w-[260px] max-w-2xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                            <textarea
                                value={
                                    editContent
                                }
                                onChange={(
                                    event
                                ) =>
                                    setEditContent(
                                        event.target.value
                                    )
                                }
                                autoFocus
                                disabled={
                                    savingEdit
                                }
                                rows={4}
                                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
                            />


                            <div className="mt-3 flex items-center justify-end gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                    disabled={
                                        savingEdit
                                    }
                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >

                                    <X
                                        size={15}
                                    />

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleSaveEdit
                                    }
                                    disabled={
                                        savingEdit ||
                                        !editContent.trim()
                                    }
                                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-black px-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {savingEdit ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check
                                            size={15}
                                        />
                                    )}

                                    {savingEdit
                                        ? "Saving..."
                                        : "Save"}

                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="group">

                            <div className="rounded-2xl rounded-br-md bg-black px-4 py-3 text-white">

                                {Array.isArray(message.attachments) &&
                                    message.attachments.map((attachment, index) => {
                                        const fileUrl = attachment.fileUrl;
                                        const mimeType = attachment.mimeType || "";
                                        const fileName = attachment.filename || "Uploaded file";

                                        if (!fileUrl) {
                                            return null;
                                        }

                                        if (mimeType.startsWith("image/")) {
                                            return (
                                                <a
                                                    key={attachment.fileId || `${fileName}-${index}`}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mb-3 block overflow-hidden rounded-xl"
                                                >
                                                    <img
                                                        src={fileUrl}
                                                        alt={fileName}
                                                        className="max-h-80 max-w-full rounded-xl object-contain"
                                                        loading="lazy"
                                                    />
                                                </a>
                                            );
                                        }

                                        if (mimeType === "application/pdf") {
                                            return (
                                                <div
                                                    key={attachment.fileId || `${fileName}-${index}`}
                                                    className="mb-3 w-full overflow-hidden rounded-xl bg-white text-slate-800"
                                                >
                                                    <iframe
                                                        src={fileUrl}
                                                        title={fileName}
                                                        className="h-72 w-full border-0"
                                                    />
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block truncate px-3 py-2 text-xs font-medium text-blue-700 underline"
                                                    >
                                                        {fileName} · Open PDF
                                                    </a>
                                                </div>
                                            );
                                        }

                                        return (
                                            <a
                                                key={attachment.fileId || `${fileName}-${index}`}
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mb-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
                                            >
                                                {mimeType.startsWith("image/") ? (
                                                    <ImageIcon size={17} />
                                                ) : (
                                                    <FileText size={17} />
                                                )}
                                                <span className="truncate underline">{fileName}</span>
                                            </a>
                                        );
                                    })}

                                <p className="whitespace-pre-wrap text-sm leading-6">
                                    {message.content}
                                </p>


                                {message.isEdited && (
                                    <p className="mt-1 text-[10px] text-slate-300">
                                        Edited
                                    </p>
                                )}

                            </div>


                            {/* USER ACTIONS */}

                            <div className="mt-1 flex justify-end gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">

                                <button
                                    type="button"
                                    onClick={
                                        handleStartEdit
                                    }
                                    className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >

                                    <Edit3
                                        size={13}
                                    />

                                    Edit

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                    className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                >

                                    {deleting ? (
                                        <LoaderCircle
                                            size={13}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Trash2
                                            size={13}
                                        />
                                    )}

                                    Delete

                                </button>

                            </div>

                        </div>

                    )}

                </div>


                {/* USER AVATAR */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-slate-600">

                    {user &&
                    user.profileImage ? (

                        <img
                            src={
                                user.profileImage
                            }
                            alt={
                                displayName
                            }
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <UserRound
                            size={17}
                        />

                    )}

                </div>

            </div>
        );
    }


    // ========================================
    // AI MESSAGE
    // ========================================

    return (
        <div className="flex gap-3">

            {/* AI AVATAR */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white">

                <span className="text-sm font-bold">
                    S
                </span>

            </div>


            <div className="min-w-0 max-w-[90%] sm:max-w-[80%]">

                <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-slate-800">

                    {message.status === "processing" ? (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <LoaderCircle size={15} className="animate-spin" />
                            Generating response...
                        </div>
                    ) : message.status === "failed" ? (

                        <div>

                            <p className="text-sm leading-6 text-red-600">
                                AI response failed.
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {message.errorMessage ||
                                    "Please try again."}
                            </p>

                        </div>

                    ) : (

                        <MarkdownMessage
                            content={
                                message.content
                            }
                        />

                    )}

                </div>


                {/* AI ACTIONS */}

                {message.status !==
                    "failed" &&
                    message.content && (
                    <div className="mt-1 flex gap-1">

                        <button
                            type="button"
                            onClick={
                                handleCopy
                            }
                            className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >

                            {copied ? (
                                <Check
                                    size={13}
                                />
                            ) : (
                                <Copy
                                    size={13}
                                />
                            )}

                            {copied
                                ? "Copied"
                                : "Copy"}

                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};


export default MessageBubble;
