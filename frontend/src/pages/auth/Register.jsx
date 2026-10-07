
import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    User
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    registerUser
} from "../../services/auth.service.js";


const Register = () => {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const trimmedName =
            name.trim();

        const trimmedEmail =
            email.trim().toLowerCase();


        // ================================
        // BASIC VALIDATION
        // ================================

        if (!trimmedName) {
            toast.error(
                "Please enter your username"
            );

            return;
        }


        if (trimmedName.length < 2) {
            toast.error(
                "Username must be at least 2 characters long"
            );

            return;
        }


        if (trimmedName.length > 50) {
            toast.error(
                "Username cannot exceed 50 characters"
            );

            return;
        }


        if (!trimmedEmail) {
            toast.error(
                "Please enter your email"
            );

            return;
        }


        if (!password) {
            toast.error(
                "Please enter your password"
            );

            return;
        }


        if (password.length < 8) {
            toast.error(
                "Password must be at least 8 characters long"
            );

            return;
        }


        if (
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^A-Za-z0-9]/.test(password)
        ) {
            toast.error(
                "Password must contain uppercase, lowercase, number and special character"
            );

            return;
        }


        if (!confirmPassword) {
            toast.error(
                "Please confirm your password"
            );

            return;
        }


        if (
            password !==
            confirmPassword
        ) {
            toast.error(
                "Passwords do not match"
            );

            return;
        }


        try {

            setLoading(true);


            const result =
                await registerUser({
                    name:
                        trimmedName,

                    email:
                        trimmedEmail,

                    password
                });


            if (
                !result ||
                !result.success
            ) {
                throw new Error(
                    "Registration failed"
                );
            }


            toast.success(
                "Registration successful"
            );


            navigate(
                "/verify-email",
                {
                    replace: true,

                    state: {
                        email:
                            trimmedEmail
                    }
                }
            );


        } catch (error) {

            let message =
                "Unable to create account. Please try again.";


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                message =
                    error.response.data.message;
            }


            if (
                error.response &&
                error.response.data &&
                error.response.data.errors
            ) {

                const errors =
                    error.response.data.errors;


                if (
                    Array.isArray(errors) &&
                    errors.length > 0
                ) {
                    message =
                        errors[0];
                }
            }


            toast.error(
                message
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                {/* =========================
                    BRAND
                ========================== */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-lg mb-4">
                        <span className="text-xl font-bold">
                            S
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Create your StudyGPT account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Start your AI-powered learning journey
                    </p>

                </div>


                {/* =========================
                    REGISTER CARD
                ========================== */}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* USERNAME */}

                        <div>

                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Username
                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(
                                        event
                                    ) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your username"
                                    autoComplete="name"
                                    disabled={loading}
                                    maxLength={50}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(
                                        event
                                    ) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>

                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                8+ characters with uppercase,
                                lowercase, number and special character.
                            </p>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2 transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}

                        </button>

                    </form>


                    {/* =========================
                        LOGIN
                    ========================== */}

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">

                        <p className="text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>


                <p className="text-center text-xs text-slate-400 mt-6">
                    Secure account verification powered by StudyGPT
                </p>

            </div>

        </div>
    );
};


export default Register;
