import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import cloudinary from "../../config/cloudinary.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";


// ========================================
// GET PROFILE
// ========================================

const getProfile = async(userId) => {
    const user =
        await User.findById(userId).select(
            "name email profileImage"
        );

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    return {
        id: user._id,
        username: user.name,
        email: user.email,
        profileImage: user.profileImage
    };
};


// ========================================
// UPDATE USERNAME
// ========================================

const updateUsername = async({
    userId,
    username
}) => {
    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    const newUsername =
        username.trim();

    if (
        newUsername.toLowerCase() ===
        user.name.toLowerCase()
    ) {
        throw new Error(
            "This is already your username"
        );
    }


    // Check duplicate username
    const existingUser =
        await User.findOne({
            _id: {
                $ne: userId
            },

            name: {
                $regex: `^${newUsername.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                )}$`,
                $options: "i"
            }
        });

    if (existingUser) {
        throw new Error(
            "Username is already taken"
        );
    }


    user.name =
        newUsername;

    await user.save();


    return {
        username: user.name,
        email: user.email,
        profileImage: user.profileImage
    };
};


// ========================================
// UPLOAD / REPLACE PROFILE IMAGE
// ========================================

const updateProfileImage = async({
    userId,
    file
}) => {
    if (!file) {
        throw new Error(
            "Profile image is required"
        );
    }


    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found"
        );
    }


    // Upload new image
    const result =
        await uploadToCloudinary(
            file.buffer, {
                folder: "studygpt/profiles"
            }
        );


    // Delete old image AFTER new image succeeds
    if (
        user.profileImagePublicId
    ) {
        try {
            await cloudinary.uploader.destroy(
                user.profileImagePublicId, {
                    resource_type: "image"
                }
            );
        } catch (error) {
            console.error(
                "Old profile image deletion failed:",
                error.message
            );
        }
    }


    user.profileImage =
        result.secure_url;

    user.profileImagePublicId =
        result.public_id;

    await user.save();


    return {
        profileImage: user.profileImage
    };
};


// ========================================
// DELETE PROFILE IMAGE
// ========================================

const deleteProfileImage = async(
    userId
) => {
    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found"
        );
    }


    // Already no image
    if (!user.profileImagePublicId) {
        user.profileImage = "";

        await user.save();

        return {
            profileImage: ""
        };
    }


    // Delete from Cloudinary
    try {
        await cloudinary.uploader.destroy(
            user.profileImagePublicId, {
                resource_type: "image"
            }
        );
    } catch (error) {
        throw new Error(
            "Unable to delete profile image"
        );
    }


    // Clear DB
    user.profileImage = "";
    user.profileImagePublicId = "";

    await user.save();


    return {
        profileImage: ""
    };
};


// ========================================
// CHANGE PASSWORD
// ========================================

const changePassword = async({
    userId,
    currentPassword,
    newPassword
}) => {
    const user =
        await User.findById(userId);

    if (!user) {
        throw new Error(
            "User not found"
        );
    }


    const isPasswordCorrect =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new Error(
            "Current password is incorrect"
        );
    }


    const isSamePassword =
        await bcrypt.compare(
            newPassword,
            user.password
        );

    if (isSamePassword) {
        throw new Error(
            "New password must be different from current password"
        );
    }


    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            12
        );

    user.password =
        hashedPassword;


    // Important:
    // Existing refresh session invalidated
    user.refreshToken = null;

    await user.save();


    return {
        email: user.email
    };
};


export {
    getProfile,
    updateUsername,
    updateProfileImage,
    deleteProfileImage,
    changePassword
};