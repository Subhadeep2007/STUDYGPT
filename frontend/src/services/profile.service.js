import api from "./api.js";


// ========================================
// GET PROFILE
// ========================================

const getProfile = async() => {

    const response =
        await api.get(
            "/api/profile"
        );

    return response.data;
};


// ========================================
// UPDATE USERNAME
// ========================================

const updateUsername = async(
    username
) => {

    const response =
        await api.patch(
            "/api/profile/username", {
                username
            }
        );

    return response.data;
};


// ========================================
// UPLOAD / REPLACE PROFILE IMAGE
// ========================================

const updateProfileImage = async(
    file
) => {

    const formData =
        new FormData();


    formData.append(
        "profileImage",
        file
    );


    const response =
        await api.patch(
            "/api/profile/image",
            formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );


    return response.data;
};


// ========================================
// DELETE PROFILE IMAGE
// ========================================

const deleteProfileImage = async() => {

    const response =
        await api.delete(
            "/api/profile/image"
        );

    return response.data;
};


// ========================================
// CHANGE PASSWORD
// ========================================

const changePassword = async({
    currentPassword,
    newPassword
}) => {

    const response =
        await api.patch(
            "/api/profile/password", {
                currentPassword,
                newPassword
            }
        );

    return response.data;
};


export {
    getProfile,
    updateUsername,
    updateProfileImage,
    deleteProfileImage,
    changePassword
};