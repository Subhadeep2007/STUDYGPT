import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    Check,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Loader2,
    Lock,
    LogOut,
    Trash2,
    User,
    X
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext.jsx";

import {
    getProfile,
    updateUsername,
    updateProfileImage,
    deleteProfileImage,
    changePassword
} from "../../services/profile.service.js";

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingUsername, setSavingUsername] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [deletingImage, setDeletingImage] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [usernameEditing, setUsernameEditing] = useState(false);

    const getResponseUser = (response) => {
        if (
            response &&
            response.data &&
            response.data.user
        ) {
            return response.data.user;
        }

        if (
            response &&
            response.data &&
            response.data.profile
        ) {
            return response.data.profile;
        }

        return null;
    };

    const loadProfile = async () => {
        try {
            setLoadingProfile(true);

            const response = await getProfile();

            const profileData = getResponseUser(response);

            if (!profileData) {
                throw new Error("Profile data not found");
            }

            setProfile(profileData);

            setUsername(
                profileData.name ||
                profileData.username ||
                ""
            );

            setEmail(profileData.email || "");

            if (profileData.profileImage) {
                setImagePreview(profileData.profileImage);
            } else {
                setImagePreview("");
            }
        } catch (error) {
            console.error("Load profile error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to load profile"
            );
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const getInitial = () => {
        const name =
            username ||
            email ||
            "U";

        return name.charAt(0).toUpperCase();
    };

    const handleUsernameSave = async () => {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            toast.error("Username cannot be empty");
            return;
        }

        try {
            setSavingUsername(true);

            const response = await updateUsername(
                trimmedUsername
            );

            const updatedUser = getResponseUser(response);

            if (updatedUser) {
                setProfile(updatedUser);

                setUsername(
                    updatedUser.name ||
                    updatedUser.username ||
                    trimmedUsername
                );

                setEmail(
                    updatedUser.email ||
                    email
                );
            } else {
                setUsername(trimmedUsername);
            }

            setUsernameEditing(false);

            toast.success("Username updated");
        } catch (error) {
            console.error("Update username error:", error);

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to update username"
            );
        } finally {
            setSavingUsername(false);
        }
    };

    const handleImageSelect = (event) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            return;
        }

        const file = files[0];

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error(
                "Only JPG, PNG and WEBP images are allowed"
            );

            event.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error("Image size must be less than 5 MB");

            event.target.value = "";
            return;
        }

        setSelectedImage(file);

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImagePreview(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            toast.error("Please select an image");
            return;
        }

        try {
            setUploadingImage(true);

            const response = await updateProfileImage(
                selectedImage
            );

            const updatedUser = getResponseUser(response);

            if (updatedUser) {
                setProfile(updatedUser);

                if (updatedUser.profileImage) {
                    setImagePreview(
                        updatedUser.profileImage
                    );
                }
            }

            setSelectedImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            toast.success("Profile image updated");
        } catch (error) {
            console.error(
                "Upload profile image error:",
                error
            );

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to update profile image"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCancelImage = () => {
        setSelectedImage(null);

        if (
            profile &&
            profile.profileImage
        ) {
            setImagePreview(
                profile.profileImage
            );
        } else {
            setImagePreview("");
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteImage = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your profile image?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingImage(true);

            await deleteProfileImage();

            setSelectedImage(null);
            setImagePreview("");

            setProfile((previousProfile) => {
                if (!previousProfile) {
                    return previousProfile;
                }

                return {
                    ...previousProfile,
                    profileImage: "",
                    profileImagePublicId: ""
                };
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            toast.success("Profile image deleted");
        } catch (error) {
            console.error(
                "Delete profile image error:",
                error
            );

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to delete profile image"
            );
        } finally {
            setDeletingImage(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (!currentPassword) {
            toast.error(
                "Enter your current password"
            );
            return;
        }

        if (!newPassword) {
            toast.error(
                "Enter your new password"
            );
            return;
        }

        if (newPassword.length < 6) {
            toast.error(
                "New password must be at least 6 characters"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(
                "Passwords do not match"
            );
            return;
        }

        try {
            setChangingPassword(true);

            await changePassword({
                currentPassword,
                newPassword
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success(
                "Password changed successfully"
            );
        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            toast.error(
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : "Failed to change password"
            );
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            await logout();

            toast.success("Logged out successfully");

            navigate("/login");
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

            toast.error(
                "Logout failed"
            );
        } finally {
            setLoggingOut(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={30}
                        className="animate-spin text-slate-700 dark:text-slate-200"
                    />

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/chat")}
                            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Back to chat"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div>
                            <h1 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                                Profile
                            </h1>

                            <p className="hidden text-xs text-slate-400 sm:block">
                                Manage your StudyGPT account
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950 sm:px-4 sm:text-sm"
                    >
                        {loggingOut ? (
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                        ) : (
                            <LogOut size={16} />
                        )}

                        <span className="hidden sm:inline">
                            Logout
                        </span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">

                {/* Profile Hero */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    <div className="h-28 bg-slate-900 dark:bg-slate-800 sm:h-36" />

                    <div className="px-5 pb-6 sm:px-8 sm:pb-8">
                        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

                            {/* Avatar */}
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-200 shadow-lg dark:border-slate-900 dark:bg-slate-700 sm:h-28 sm:w-28">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-slate-600 dark:text-slate-200 sm:text-4xl">
                                            {getInitial()}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md transition hover:bg-slate-700 dark:border-slate-900 dark:bg-white dark:text-slate-900"
                                    title="Change profile image"
                                >
                                    <Camera size={16} />
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            <div className="sm:pb-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {username || "StudyGPT User"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                                    {email}
                                </p>
                            </div>
                        </div>

                        {/* Image Actions */}
                        {selectedImage && (
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleImageUpload}
                                    disabled={uploadingImage}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                    {uploadingImage ? (
                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check size={15} />
                                    )}

                                    Save image
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelImage}
                                    disabled={uploadingImage}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* Account Information */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                <User
                                    size={19}
                                    className="text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Account Information
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Your basic account details
                                </p>
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Username
                                </label>

                                {!usernameEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUsernameEditing(true);
                                        }}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {usernameEditing ? (
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(event) => {
                                            setUsername(
                                                event.target.value
                                            );
                                        }}
                                        maxLength={50}
                                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleUsernameSave}
                                            disabled={savingUsername}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-slate-900 sm:flex-none"
                                        >
                                            {savingUsername ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Check size={14} />
                                            )}

                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUsername(
                                                    profile &&
                                                    profile.name
                                                        ? profile.name
                                                        : ""
                                                );

                                                setUsernameEditing(false);
                                            }}
                                            disabled={savingUsername}
                                            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-500 dark:border-slate-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    {username || "Not set"}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mt-5">
                            <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Email
                            </label>

                            <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
                                {email || "No email available"}
                            </div>

                            <p className="mt-2 text-[11px] text-slate-400">
                                Email is used for account verification and password recovery.
                            </p>
                        </div>
                    </section>

                    {/* Profile Image */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                <ImageIcon
                                    size={19}
                                    className="text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Profile Image
                                </h2>

                                <p className="text-xs text-slate-400">
                                    JPG, PNG or WEBP • Maximum 5 MB
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 py-8 dark:border-slate-700">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User
                                        size={30}
                                        className="text-slate-400"
                                    />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.click();
                                    }
                                }}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Choose image
                            </button>

                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    disabled={deletingImage}
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                                >
                                    {deletingImage ? (
                                        <Loader2
                                            size={13}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Trash2 size={13} />
                                    )}

                                    Remove image
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Change Password */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7 lg:col-span-2">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                <Lock
                                    size={19}
                                    className="text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Change Password
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Keep your StudyGPT account secure
                                </p>
                            </div>
                        </div>

                        <form
                            onSubmit={handleChangePassword}
                            className="grid gap-4 md:grid-cols-3"
                        >
                            {/* Current */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Current Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={currentPassword}
                                        onChange={(event) => {
                                            setCurrentPassword(
                                                event.target.value
                                            );
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        placeholder="Current password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            );
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    New Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={newPassword}
                                        onChange={(event) => {
                                            setNewPassword(
                                                event.target.value
                                            );
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        placeholder="New password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowNewPassword(
                                                !showNewPassword
                                            );
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(
                                                event.target.value
                                            );
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        placeholder="Confirm password"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            );
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[11px] text-slate-400">
                                        Use a strong password with at least 6 characters.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                    >
                                        {changingPassword ? (
                                            <Loader2
                                                size={15}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Lock size={15} />
                                        )}

                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>

                    {/* Logout Mobile-friendly */}
                    <section className="rounded-3xl border border-red-100 bg-red-50 p-5 dark:border-red-950 dark:bg-red-950/30 sm:p-7 lg:col-span-2">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
                                    Sign out of StudyGPT
                                </h2>

                                <p className="mt-1 text-xs text-red-600/70 dark:text-red-400/70">
                                    You can sign back in anytime with your account.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/40 dark:hover:bg-red-950"
                            >
                                {loggingOut ? (
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <LogOut size={15} />
                                )}

                                Logout
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Profile;