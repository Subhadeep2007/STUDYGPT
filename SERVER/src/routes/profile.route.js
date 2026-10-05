import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
    profileUpload
} from "../middleware/upload.middleware.js";

import {
    changePasswordSchema
} from "../validators/auth.validator.js";

import {
    updateUsernameSchema
} from "../validators/profile.validator.js";

import {
    getProfileController,
    updateUsernameController,
    updateProfileImageController,
    deleteProfileImageController,
    changePasswordController
} from "../controllers/profile/profile.controller.js";


const router =
    express.Router();


// ========================================
// GET PROFILE
// ========================================

router.get(
    "/",
    authMiddleware,
    getProfileController
);


// ========================================
// UPDATE USERNAME
// ========================================

router.patch(
    "/username",
    authMiddleware,
    validate(updateUsernameSchema),
    updateUsernameController
);


// ========================================
// UPDATE PROFILE IMAGE
// ========================================

router.patch(
    "/image",
    authMiddleware,
    profileUpload.single(
        "profileImage"
    ),
    updateProfileImageController
);


// ========================================
// DELETE PROFILE IMAGE
// ========================================

router.delete(
    "/image",
    authMiddleware,
    deleteProfileImageController
);


// ========================================
// CHANGE PASSWORD
// ========================================

router.patch(
    "/password",
    authMiddleware,
    validate(changePasswordSchema),
    changePasswordController
);


export default router;