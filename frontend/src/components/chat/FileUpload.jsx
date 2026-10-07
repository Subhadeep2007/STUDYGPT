import {
    useCallback,
    useState
} from "react";

import {
    useDropzone
} from "react-dropzone";

import {
    File,
    FileText,
    Image,
    Presentation,
    Upload,
    X,
    LoaderCircle,
    CheckCircle2
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    uploadFiles
} from "../../services/file.service.js";


// ========================================
// HELPERS
// ========================================

const getFileIcon = (mimeType) => {

    if (
        mimeType.startsWith("image/")
    ) {
        return (
            <Image
                size={20}
                className="text-blue-500"
            />
        );
    }


    if (
        mimeType === "application/pdf"
    ) {
        return (
            <FileText
                size={20}
                className="text-red-500"
            />
        );
    }


    if (
        mimeType ===
        "application/msword" ||
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        mimeType === "text/plain"
    ) {
        return (
            <FileText
                size={20}
                className="text-emerald-500"
            />
        );
    }


    if (
        mimeType ===
        "application/vnd.ms-powerpoint" ||
        mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
        return (
            <Presentation
                size={20}
                className="text-orange-500"
            />
        );
    }


    return (
        <File
            size={20}
            className="text-slate-500"
        />
    );
};


const formatFileSize = (bytes) => {

    if (bytes < 1024) {
        return `${bytes} B`;
    }


    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
};


// ========================================
// FILE UPLOAD COMPONENT
// ========================================

const FileUpload = ({
    chatId,
    onUploaded,
    disabled = false
}) => {

    const [selectedFiles, setSelectedFiles] =
        useState([]);

    const [uploading, setUploading] =
        useState(false);

    const [uploadedFiles, setUploadedFiles] =
        useState([]);


    // ========================================
    // ADD FILES
    // ========================================

    const onDrop = useCallback(
        (acceptedFiles) => {

            if (disabled) {
                return;
            }


            if (
                acceptedFiles.length === 0
            ) {
                return;
            }


            setSelectedFiles(
                (previousFiles) => {

                    const combinedFiles = [
                        ...previousFiles,
                        ...acceptedFiles
                    ];


                    const uniqueFiles = [];


                    for (
                        let i = 0;
                        i < combinedFiles.length;
                        i++
                    ) {

                        const currentFile =
                            combinedFiles[i];


                        let alreadyExists =
                            false;


                        for (
                            let j = 0;
                            j < uniqueFiles.length;
                            j++
                        ) {

                            const existingFile =
                                uniqueFiles[j];


                            if (
                                existingFile.name ===
                                    currentFile.name &&
                                existingFile.size ===
                                    currentFile.size &&
                                existingFile.lastModified ===
                                    currentFile.lastModified
                            ) {

                                alreadyExists =
                                    true;

                                break;
                            }
                        }


                        if (
                            !alreadyExists
                        ) {

                            uniqueFiles.push(
                                currentFile
                            );
                        }
                    }


                    if (
                        uniqueFiles.length > 5
                    ) {

                        toast.error(
                            "You can upload maximum 5 files"
                        );


                        return uniqueFiles.slice(
                            0,
                            5
                        );
                    }


                    return uniqueFiles;
                }
            );
        },
        [
            disabled
        ]
    );


    // ========================================
    // DROPZONE
    // ========================================

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open
    } = useDropzone({
        onDrop,

        noClick: true,

        noKeyboard: true,

        disabled,

        maxFiles: 5,

        maxSize:
            10 * 1024 * 1024,

        accept: {
            "image/jpeg": [
                ".jpg",
                ".jpeg"
            ],

            "image/png": [
                ".png"
            ],

            "image/webp": [
                ".webp"
            ],

            "application/pdf": [
                ".pdf"
            ],

            "application/msword": [
                ".doc"
            ],

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [
                    ".docx"
                ],

            "text/plain": [
                ".txt"
            ],

            "application/vnd.ms-powerpoint": [
                ".ppt"
            ],

            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                [
                    ".pptx"
                ]
        },

        onDropRejected: (
            rejectedFiles
        ) => {

            if (
                rejectedFiles.length === 0
            ) {
                return;
            }


            const firstRejected =
                rejectedFiles[0];


            if (
                firstRejected &&
                firstRejected.errors &&
                firstRejected.errors.length > 0
            ) {

                const firstError =
                    firstRejected.errors[0];


                if (
                    firstError.code ===
                    "file-too-large"
                ) {

                    toast.error(
                        "Each file must be 10MB or smaller"
                    );

                    return;
                }
            }


            toast.error(
                "Unsupported file type"
            );
        }
    });


    // ========================================
    // REMOVE SELECTED FILE
    // ========================================

    const removeSelectedFile = (
        index
    ) => {

        setSelectedFiles(
            (previousFiles) => {

                const updatedFiles = [];


                for (
                    let i = 0;
                    i < previousFiles.length;
                    i++
                ) {

                    if (
                        i !== index
                    ) {

                        updatedFiles.push(
                            previousFiles[i]
                        );
                    }
                }


                return updatedFiles;
            }
        );
    };


    // ========================================
    // CLEAR FILES
    // ========================================

    const clearFiles = () => {

        setSelectedFiles([]);

        setUploadedFiles([]);
    };


    // ========================================
    // UPLOAD
    // ========================================

    const handleUpload = async () => {

        if (
            selectedFiles.length === 0
        ) {

            toast.error(
                "Please select at least one file"
            );

            return;
        }


        if (!chatId) {

            toast.error(
                "Please create a chat first"
            );

            return;
        }


        if (uploading) {
            return;
        }


        try {

            setUploading(true);


            const result =
                await uploadFiles({
                    files:
                        selectedFiles,

                    chatId:
                        chatId
                });


            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "File upload failed"
                );
            }


            let files = [];


            if (
                result.data &&
                Array.isArray(
                    result.data.files
                )
            ) {

                files =
                    result.data.files;
            }


            setUploadedFiles(
                files
            );


            setSelectedFiles([]);


            toast.success(
                "Files uploaded successfully"
            );


            if (onUploaded) {

                onUploaded(
                    files
                );
            }

        } catch (error) {

            let message =
                "Unable to upload files";


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                message =
                    error.response.data.message;
            }


            toast.error(
                message
            );

        } finally {

            setUploading(false);
        }
    };


    return (
        <div className="w-full space-y-3">

            {/* ====================================
                DROP AREA
            ===================================== */}

            <div
                {...getRootProps()}
                className={`
                    rounded-2xl border-2 border-dashed p-4 transition
                    ${
                        isDragActive
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 bg-white"
                    }
                    ${
                        disabled
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }
                `}
            >

                <input
                    {...getInputProps()}
                />


                <div className="flex flex-col items-center justify-center py-6 text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">

                        <Upload
                            size={22}
                            className="text-slate-600"
                        />

                    </div>


                    <p className="mt-3 text-sm font-semibold text-slate-800">

                        {isDragActive
                            ? "Drop your files here"
                            : "Upload study material"}

                    </p>


                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">

                        PDF, DOC, DOCX, TXT, PPT,
                        PPTX, JPG, PNG or WEBP

                    </p>


                    <button
                        type="button"
                        onClick={open}
                        disabled={
                            disabled ||
                            uploading
                        }
                        className="mt-4 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Choose files
                    </button>

                </div>

            </div>


            {/* ====================================
                SELECTED FILES
            ===================================== */}

            {selectedFiles.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-3">

                    <div className="mb-3 flex items-center justify-between">

                        <p className="text-sm font-semibold text-slate-800">
                            Selected files
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFiles
                            }
                            disabled={
                                uploading
                            }
                            className="text-xs font-medium text-slate-500 hover:text-red-500"
                        >
                            Clear all
                        </button>

                    </div>


                    <div className="space-y-2">

                        {selectedFiles.map(
                            (
                                file,
                                index
                            ) => (

                                <div
                                    key={`${file.name}-${file.size}-${file.lastModified}`}
                                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">

                                        {getFileIcon(
                                            file.type
                                        )}

                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-medium text-slate-700">
                                            {file.name}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatFileSize(
                                                file.size
                                            )}
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSelectedFile(
                                                index
                                            )
                                        }
                                        disabled={
                                            uploading
                                        }
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-red-500 disabled:opacity-50"
                                        aria-label={`Remove ${file.name}`}
                                    >

                                        <X
                                            size={16}
                                        />

                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    {/* UPLOAD BUTTON */}

                    <button
                        type="button"
                        onClick={
                            handleUpload
                        }
                        disabled={
                            uploading ||
                            selectedFiles.length === 0
                        }
                        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {uploading ? (
                            <>
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />

                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload
                                    size={17}
                                />

                                Upload{" "}
                                {selectedFiles.length}{" "}
                                {selectedFiles.length === 1
                                    ? "file"
                                    : "files"}
                            </>
                        )}

                    </button>

                </div>
            )}


            {/* ====================================
                UPLOADED FILES
            ===================================== */}

            {uploadedFiles.length > 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">

                    <div className="mb-2 flex items-center gap-2">

                        <CheckCircle2
                            size={17}
                            className="text-emerald-600"
                        />

                        <p className="text-sm font-semibold text-emerald-700">
                            Uploaded successfully
                        </p>

                    </div>


                    <div className="space-y-1">

                        {uploadedFiles.map(
                            (file) => {

                                let fileName =
                                    "Uploaded file";


                                if (
                                    file &&
                                    file.originalName
                                ) {

                                    fileName =
                                        file.originalName;
                                }


                                return (
                                    <p
                                        key={
                                            file.id ||
                                            fileName
                                        }
                                        className="truncate text-xs text-emerald-700"
                                    >
                                        {fileName}
                                    </p>
                                );
                            }
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};


export default FileUpload;