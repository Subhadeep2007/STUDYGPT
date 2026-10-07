import { useRef, useState } from "react";
import {
    Paperclip,
    Send,
    X,
    FileText,
    Image as ImageIcon,
    File
} from "lucide-react";
import { uploadFiles } from "../../services/file.service.js";

const ChatComposer = ({
    chatId,
    onMessageSent,
    disabled = false
}) => {
    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const remainingSlots = 5 - selectedFiles.length;
        const filesToAdd = files.slice(0, remainingSlots);

        const validFiles = filesToAdd.filter((file) => {
            const maxSize = 10 * 1024 * 1024;

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ];

            return (
                allowedTypes.includes(file.type) &&
                file.size <= maxSize
            );
        });

        setSelectedFiles((previousFiles) => {
            return [...previousFiles, ...validFiles];
        });

        event.target.value = "";
    };

    const removeFile = (index) => {
        setSelectedFiles((previousFiles) => {
            return previousFiles.filter((_, fileIndex) => fileIndex !== index);
        });
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith("image/")) {
            return <ImageIcon size={18} />;
        }

        if (
            file.type === "application/pdf" ||
            file.type.includes("word") ||
            file.type.includes("text") ||
            file.type.includes("powerpoint")
        ) {
            return <FileText size={18} />;
        }

        return <File size={18} />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const uploadSelectedFiles = async () => {
        if (selectedFiles.length === 0) {
            return [];
        }

        setUploading(true);

        try {
            const response = await uploadFiles({
                files: selectedFiles,
                chatId
            });

            if (!response || !response.data) {
                throw new Error("File upload failed");
            }

            const uploadedFiles = response.data.files || [];

            return uploadedFiles;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage && selectedFiles.length === 0) {
            return;
        }

        if (disabled || uploading) {
            return;
        }

        try {
            let uploadedFiles = [];

            if (selectedFiles.length > 0) {
                uploadedFiles = await uploadSelectedFiles();
            }

            const attachments = uploadedFiles.map((file) => {
                return {
                    fileId: file._id,
                    filename: file.originalName,
                    mimeType: file.mimeType,
                    fileUrl: file.cloudinaryUrl
                };
            });

            const messagePayload = {
                content: trimmedMessage,
                attachments
            };

            await onMessageSent(messagePayload);

            setMessage("");
            setSelectedFiles([]);

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (error) {
            console.error("Message send error:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    const handleTextareaChange = (event) => {
        setMessage(event.target.value);

        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const isSubmitDisabled =
        disabled ||
        uploading ||
        (!message.trim() && selectedFiles.length === 0);

    return (
        <div className="w-full">
            {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => {
                        return (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    {getFileIcon(file)}
                                </div>

                                <div className="min-w-0">
                                    <p className="max-w-[180px] truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                                        {file.name}
                                    </p>

                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                    className="ml-1 shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        disabled={
                            disabled ||
                            uploading ||
                            selectedFiles.length >= 5
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        title="Attach files"
                    >
                        <Paperclip size={20} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.txt,.ppt,.pptx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        disabled={disabled || uploading}
                        rows={1}
                        placeholder={
                            uploading
                                ? "Uploading files..."
                                : "Ask StudyGPT anything..."
                        }
                        className="max-h-40 min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-white dark:placeholder:text-slate-500"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                        title="Send message"
                    >
                        {uploading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>

                <div className="px-12 pb-1 pt-1">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Enter to send • Shift + Enter for new line • Maximum 5 files
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ChatComposer;