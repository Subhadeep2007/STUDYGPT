import {
    uploadFile,
    getFileById,
    getChatFiles,
    deleteFile
} from "../../services/file/file.service.js";


// ========================================
// UPLOAD FILES
// ========================================

const uploadFilesController = async(
    req,
    res,
    next
) => {
    try {
        const userId =
            req.user.userId;

        const chatId =
            req.body.chatId || null;

        if (!req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one file is required"
            });
        }


        const uploadedFiles = [];


        for (const file of req.files) {
            const result =
                await uploadFile({
                    userId,
                    chatId,
                    file
                });

            uploadedFiles.push(result);
        }


        return res.status(201).json({
            success: true,
            message: "Files uploaded successfully",

            data: {
                files: uploadedFiles
            }
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET SINGLE FILE
// ========================================

const getFileController = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await getFileById({
                userId: req.user.userId,

                fileId: req.params.fileId
            });


        return res.status(200).json({
            success: true,
            message: "File fetched successfully",

            data: result
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET CHAT FILES
// ========================================

const getChatFilesController =
    async(
        req,
        res,
        next
    ) => {
        try {
            const result =
                await getChatFiles({
                    userId: req.user.userId,

                    chatId: req.params.chatId
                });


            return res.status(200).json({
                success: true,
                message: "Chat files fetched successfully",

                data: {
                    files: result
                }
            });

        } catch (error) {
            next(error);
        }
    };


// ========================================
// DELETE FILE
// ========================================

const deleteFileController = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await deleteFile({
                userId: req.user.userId,

                fileId: req.params.fileId
            });


        return res.status(200).json({
            success: true,
            message: "File deleted successfully",

            data: result
        });

    } catch (error) {
        next(error);
    }
};


export {
    uploadFilesController,
    getFileController,
    getChatFilesController,
    deleteFileController
};