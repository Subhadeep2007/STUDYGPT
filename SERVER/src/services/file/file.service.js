import { GoogleGenAI } from "@google/genai";

import File from "../../models/file.js";
import cloudinary from "../../config/cloudinary.js";


// ========================================
// GEMINI CLIENT
// ========================================

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ========================================
// HELPER
// ========================================

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};


// ========================================
// UPLOAD BUFFER TO CLOUDINARY
// ========================================

const uploadBufferToCloudinary = (
    buffer,
    options
) => {
    return new Promise((resolve, reject) => {

        const originalName =
            options.originalName;

        const mimeType =
            options.mimeType;


        let resourceType = "raw";

        if (
            mimeType.startsWith("image/")
        ) {
            resourceType = "image";
        }


        const uploadStream =
            cloudinary.uploader.upload_stream({
                    folder: "studygpt/files",

                    resource_type: resourceType,

                    use_filename: true,

                    unique_filename: true,

                    filename_override: originalName
                },

                (error, result) => {

                    if (error) {
                        return reject(error);
                    }

                    if (!result) {
                        return reject(
                            new Error(
                                "Cloudinary upload failed"
                            )
                        );
                    }

                    resolve(result);
                }
            );


        uploadStream.end(buffer);
    });
};


// ========================================
// UPLOAD BUFFER TO GEMINI
// ========================================

const uploadBufferToGemini = async({
    buffer,
    originalName,
    mimeType
}) => {

    const fileBlob = new Blob(
        [buffer], {
            type: mimeType
        }
    );


    const geminiFile =
        await gemini.files.upload({
            file: fileBlob,

            config: {
                displayName: originalName,

                mimeType: mimeType
            }
        });


    // ====================================
    // CHECK GEMINI UPLOAD
    // ====================================

    if (!geminiFile ||
        !geminiFile.name
    ) {
        throw new Error(
            "Gemini file upload failed"
        );
    }


    // ====================================
    // GET FILE STATUS
    // ====================================

    let fileInfo =
        await gemini.files.get({
            name: geminiFile.name
        });


    if (!fileInfo) {
        throw new Error(
            "Unable to get Gemini file information"
        );
    }


    // ====================================
    // WAIT FOR PROCESSING
    // ====================================

    let attempts = 0;

    const maxAttempts = 30;


    while (
        fileInfo &&
        fileInfo.state === "PROCESSING" &&
        attempts < maxAttempts
    ) {

        await sleep(2000);


        fileInfo =
            await gemini.files.get({
                name: geminiFile.name
            });


        if (!fileInfo) {
            throw new Error(
                "Unable to check Gemini file status"
            );
        }


        attempts++;
    }


    // ====================================
    // FAILED
    // ====================================

    if (
        fileInfo &&
        fileInfo.state === "FAILED"
    ) {
        throw new Error(
            "Gemini file processing failed"
        );
    }


    // ====================================
    // NOT ACTIVE
    // ====================================

    if (!fileInfo ||
        fileInfo.state !== "ACTIVE"
    ) {
        throw new Error(
            "Gemini file processing did not complete"
        );
    }


    // ====================================
    // CHECK URI
    // ====================================

    if (!fileInfo.uri) {
        throw new Error(
            "Gemini file URI not available"
        );
    }


    return {
        name: fileInfo.name,

        uri: fileInfo.uri,

        mimeType: fileInfo.mimeType ||
            mimeType
    };
};

// ========================================
// REFRESH GEMINI FILE FROM CLOUDINARY
// ========================================

const refreshGeminiFileFromCloudinary = async({
    userId,
    fileId
}) => {

    const file = await File.findOne({
        _id: fileId,
        userId
    });

    if (!file) {
        throw new Error(
            "File not found"
        );
    }

    if (!file.cloudinaryUrl) {
        throw new Error(
            `Source file "${file.originalName}" is not available`
        );
    }

    console.log(
        `Refreshing Gemini file: ${file.originalName}`
    );

    const cloudinaryResponse =
        await fetch(file.cloudinaryUrl);

    if (!cloudinaryResponse.ok) {
        throw new Error(
            `Unable to download "${file.originalName}" from Cloudinary`
        );
    }

    const arrayBuffer =
        await cloudinaryResponse.arrayBuffer();

    const buffer =
        Buffer.from(arrayBuffer);

    const geminiResult =
        await uploadBufferToGemini({
            buffer,
            originalName: file.originalName,
            mimeType: file.mimeType
        });

    if (!geminiResult ||
        !geminiResult.name ||
        !geminiResult.uri
    ) {
        throw new Error(
            `Unable to refresh "${file.originalName}" on Gemini`
        );
    }

    const updatedFile =
        await File.findOneAndUpdate({
            _id: fileId,
            userId
        }, {
            $set: {
                geminiFileName: geminiResult.name,

                geminiFileUri: geminiResult.uri,

                geminiMimeType: geminiResult.mimeType,

                status: "ready"
            }
        }, {
            new: true
        });

    if (!updatedFile) {
        throw new Error(
            "Unable to update refreshed Gemini file"
        );
    }

    console.log(
        `Gemini file refreshed successfully: ${file.originalName}`
    );

    return {
        fileId: updatedFile._id,
        originalName: updatedFile.originalName,
        uri: updatedFile.geminiFileUri,
        mimeType: updatedFile.geminiMimeType ||
            updatedFile.mimeType
    };
};
// ========================================
// DELETE GEMINI FILE
// ========================================

const deleteGeminiFile = async(
    fileName
) => {

    if (!fileName) {
        return;
    }


    try {

        await gemini.files.delete({
            name: fileName
        });

    } catch (error) {

        console.error(
            "Gemini file deletion failed:",
            error.message
        );
    }
};


// ========================================
// DELETE CLOUDINARY FILE
// ========================================

const deleteCloudinaryFile = async({
    publicId,
    resourceType
}) => {

    if (!publicId) {
        return;
    }


    try {

        await cloudinary.uploader.destroy(
            publicId, {
                resource_type: resourceType ||
                    "raw"
            }
        );

    } catch (error) {

        console.error(
            "Cloudinary file deletion failed:",
            error.message
        );
    }
};


// ========================================
// UPLOAD FILE
// ========================================

const uploadFile = async({
    userId,
    chatId,
    file
}) => {

    if (!file) {
        throw new Error(
            "File is required"
        );
    }


    const originalName =
        file.originalname;

    const mimeType =
        file.mimetype;

    const size =
        file.size;

    const buffer =
        file.buffer;


    if (!originalName) {
        throw new Error(
            "File name is missing"
        );
    }


    if (!mimeType) {
        throw new Error(
            "File type is missing"
        );
    }


    if (!buffer) {
        throw new Error(
            "File data is missing"
        );
    }


    let cloudinaryResult = null;
    let geminiResult = null;


    try {

        // ==================================
        // CLOUDINARY
        // ==================================

        cloudinaryResult =
            await uploadBufferToCloudinary(
                buffer, {
                    originalName,
                    mimeType
                }
            );


        if (!cloudinaryResult ||
            !cloudinaryResult.public_id ||
            !cloudinaryResult.secure_url
        ) {
            throw new Error(
                "Cloudinary upload failed"
            );
        }


        // ==================================
        // GEMINI
        // ==================================

        geminiResult =
            await uploadBufferToGemini({
                buffer,

                originalName,

                mimeType
            });


        if (!geminiResult ||
            !geminiResult.name ||
            !geminiResult.uri
        ) {
            throw new Error(
                "Gemini file upload failed"
            );
        }


        // ==================================
        // RESOURCE TYPE
        // ==================================

        let cloudinaryResourceType =
            "raw";

        if (
            mimeType.startsWith("image/")
        ) {
            cloudinaryResourceType =
                "image";
        }


        // ==================================
        // SAVE DATABASE
        // ==================================

        const savedFile =
            await File.create({
                userId,

                chatId: chatId || null,

                originalName,

                mimeType,

                size,

                cloudinaryUrl: cloudinaryResult.secure_url,

                cloudinaryPublicId: cloudinaryResult.public_id,

                cloudinaryResourceType,

                geminiFileName: geminiResult.name,

                geminiFileUri: geminiResult.uri,

                geminiMimeType: geminiResult.mimeType,

                status: "ready",

                purpose: "chat"
            });


        if (!savedFile) {
            throw new Error(
                "Unable to save file information"
            );
        }


        return {
            id: savedFile._id,

            originalName: savedFile.originalName,

            mimeType: savedFile.mimeType,

            size: savedFile.size,

            cloudinaryUrl: savedFile.cloudinaryUrl,

            geminiFileName: savedFile.geminiFileName,

            geminiFileUri: savedFile.geminiFileUri,

            status: savedFile.status
        };


    } catch (error) {

        // ==================================
        // CLEAN CLOUDINARY
        // ==================================

        if (
            cloudinaryResult &&
            cloudinaryResult.public_id
        ) {

            let resourceType =
                "raw";

            if (
                mimeType.startsWith(
                    "image/"
                )
            ) {
                resourceType =
                    "image";
            }


            await deleteCloudinaryFile({
                publicId: cloudinaryResult.public_id,

                resourceType
            });
        }


        // ==================================
        // CLEAN GEMINI
        // ==================================

        if (
            geminiResult &&
            geminiResult.name
        ) {

            await deleteGeminiFile(
                geminiResult.name
            );
        }


        throw error;
    }
};


// ========================================
// GET SINGLE FILE
// ========================================

const getFileById = async({
    userId,
    fileId
}) => {

    const file =
        await File.findOne({
            _id: fileId,

            userId
        });


    if (!file) {
        throw new Error(
            "File not found"
        );
    }


    return file;
};


// ========================================
// GET CHAT FILES
// ========================================

const getChatFiles = async({
    userId,
    chatId
}) => {

    const files =
        await File.find({
            userId,

            chatId,

            purpose: "chat"
        })
        .sort({
            createdAt: 1
        })
        .select(
            "originalName mimeType size cloudinaryUrl geminiFileName geminiFileUri status createdAt"
        );


    return files;
};


// ========================================
// DELETE FILE
// ========================================

const deleteFile = async({
    userId,
    fileId
}) => {

    const file =
        await File.findOne({
            _id: fileId,

            userId
        });


    if (!file) {
        throw new Error(
            "File not found"
        );
    }


    // ==================================
    // DELETE GEMINI
    // ==================================

    if (
        file.geminiFileName
    ) {

        await deleteGeminiFile(
            file.geminiFileName
        );
    }


    // ==================================
    // DELETE CLOUDINARY
    // ==================================

    if (
        file.cloudinaryPublicId
    ) {

        await deleteCloudinaryFile({
            publicId: file.cloudinaryPublicId,

            resourceType: file.cloudinaryResourceType
        });
    }


    // ==================================
    // DELETE DATABASE
    // ==================================

    await File.deleteOne({
        _id: fileId
    });


    return {
        id: fileId
    };
};


export {
    uploadFile,
    getFileById,
    getChatFiles,
    deleteFile,
    refreshGeminiFileFromCloudinary
};