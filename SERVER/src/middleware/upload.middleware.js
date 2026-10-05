import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",

    // PDF
    "application/pdf",

    // Word
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Text
    "text/plain",

    // PowerPoint
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
];

const chatUpload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 5
    },

    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Unsupported file type. Please upload PDF, DOC, DOCX, TXT, PPT, PPTX or image."
                )
            );
        }

        cb(null, true);
    }
});

export default chatUpload;