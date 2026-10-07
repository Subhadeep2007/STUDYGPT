import api from "./api.js";


// ========================================
// UPLOAD MULTIPLE FILES
// ========================================

const uploadFiles = async({
    files,
    chatId
}) => {

    if (!files) {
        throw new Error(
            "Files are required"
        );
    }


    if (!Array.isArray(files)) {
        throw new Error(
            "Files must be an array"
        );
    }


    if (files.length === 0) {
        throw new Error(
            "At least one file is required"
        );
    }


    if (files.length > 5) {
        throw new Error(
            "You can upload maximum 5 files at a time"
        );
    }


    const formData =
        new FormData();


    for (
        let i = 0; i < files.length; i++
    ) {

        formData.append(
            "files",
            files[i]
        );
    }


    if (chatId) {
        formData.append(
            "chatId",
            chatId
        );
    }


    const response =
        await api.post(
            "/api/files/upload",
            formData
        );


    return response.data;
};


// ========================================
// GET SINGLE FILE
// ========================================

const getFile = async(
    fileId
) => {

    const response =
        await api.get(
            ` / api / files / $ { fileId }
`
        );


    return response.data;
};


// ========================================
// GET ALL FILES OF CHAT
// ========================================

const getChatFiles = async(
    chatId
) => {

    const response =
        await api.get(
            ` / api / files / chat / $ { chatId }
`
        );


    return response.data;
};


// ========================================
// DELETE FILE
// ========================================

const deleteFile = async(
    fileId
) => {

    const response =
        await api.delete(
            ` / api / files / $ { fileId }
`
        );


    return response.data;
};


// ========================================
// EXPORT
// ========================================

export {
    uploadFiles,
    getFile,
    getChatFiles,
    deleteFile
};