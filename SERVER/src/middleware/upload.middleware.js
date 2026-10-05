import multer from "multer";

const storage = multer.memoryStorage();


// ===============================
// CHAT FILE UPLOAD
// ===============================

const chatAllowedTypes = [
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
        fileSize: 100 * 1024 * 1024,
        files: 50
    },

    fileFilter: (req, file, cb) => {
        if (!chatAllowedTypes.includes(
                file.mimetype
            )) {
            return cb(
                new Error(
                    "Unsupported file type"
                )
            );
        }

        cb(null, true);
    }
});


// ===============================
// PROFILE IMAGE UPLOAD
// ===============================

const profileAllowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const profileUpload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, cb) => {
        if (!profileAllowedTypes.includes(
                file.mimetype
            )) {
            return cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                )
            );
        }

        cb(null, true);
    }
});


export {
    chatUpload,
    profileUpload
};