import {
    getProfile,
    updateUsername,
    updateProfileImage,
    deleteProfileImage,
    changePassword
} from "../../services/profile/profile.service.js";


// ========================================
// GET PROFILE
// ========================================

const getProfileController = async(
    req,
    res,
    next
) => {
    try {
        const result =
            await getProfile(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


// ========================================
// UPDATE USERNAME
// ========================================

const updateUsernameController =
    async(
        req,
        res,
        next
    ) => {
        try {
            const result =
                await updateUsername({
                    userId: req.user.userId,

                    username: req.body.username
                });

            return res.status(200).json({
                success: true,
                message: "Username updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };


// ========================================
// UPLOAD PROFILE IMAGE
// ========================================

const updateProfileImageController =
    async(
        req,
        res,
        next
    ) => {
        try {
            const result =
                await updateProfileImage({
                    userId: req.user.userId,

                    file: req.file
                });

            return res.status(200).json({
                success: true,
                message: "Profile image updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };


// ========================================
// DELETE PROFILE IMAGE
// ========================================

const deleteProfileImageController =
    async(
        req,
        res,
        next
    ) => {
        try {
            const result =
                await deleteProfileImage(
                    req.user.userId
                );

            return res.status(200).json({
                success: true,
                message: "Profile image deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };


// ========================================
// CHANGE PASSWORD
// ========================================

const changePasswordController =
    async(
        req,
        res,
        next
    ) => {
        try {
            await changePassword({
                userId: req.user.userId,

                currentPassword: req.body.currentPassword,

                newPassword: req.body.newPassword
            });

            return res.status(200).json({
                success: true,
                message: "Password changed successfully. Please login again."
            });
        } catch (error) {
            next(error);
        }
    };


export {
    getProfileController,
    updateUsernameController,
    updateProfileImageController,
    deleteProfileImageController,
    changePasswordController
};