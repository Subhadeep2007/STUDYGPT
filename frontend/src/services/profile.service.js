import api from "./api.js";

const getProfile = async() => {
    const response = await api.get("/api/profile");
    return response.data;
};

const updateUsername = async(username) => {
    const response = await api.patch(
        "/api/profile/username", {
            username
        }
    );

    return response.data;
};

const updateProfileImage = async(file) => {
    const formData = new FormData();

    formData.append(
        "profileImage",
        file
    );

    const response = await api.patch(
        "/api/profile/image",
        formData
    );

    return response.data;
};

const deleteProfileImage = async() => {
    const response = await api.delete(
        "/api/profile/image"
    );

    return response.data;
};

const changePassword = async({
    currentPassword,
    newPassword
}) => {
    const response = await api.patch(
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