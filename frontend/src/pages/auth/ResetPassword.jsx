
import {
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    Mail
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    verifyResetPasswordOTP,
    resetPassword
} from "../../services/auth.service.js";


const ResetPassword = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    // ========================================
    // GET EMAIL FROM PREVIOUS PAGE
    // ========================================

    let initialEmail = "";

    if (
        location.state &&
        location.state.email
    ) {
        initialEmail =
            location.state.email;
    }


    const [email, setEmail] =
        useState(initialEmail);

    const [otp, setOtp] =
        useState("");

    const [otpVerified, setOtpVerified] =
        useState(false);

    const [newPassword, setNewPassword] =
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
    // OTP INPUT
    // ========================================

    const handleOtpChange = (
        event
    ) => {

        const value =
            event.target.value;


        const numericValue =
            value.replace(
                /[^0-9]/g,
                ""
            );


        if (
            numericValue.length <= 6
        ) {

            setOtp(
                numericValue
            );
            setOtpVerified(false);
        }
    };


    const handleVerifyOTP = async () => {
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            toast.error("Please enter your email");
            return;
        }

        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const result = await verifyResetPasswordOTP({
                email: trimmedEmail,
                otp
            });

            if (!result || !result.success) {
                throw new Error("Unable to verify reset OTP");
            }

            setEmail(trimmedEmail);
            setOtpVerified(true);
            toast.success("OTP verified. Set your new password.");
        } catch (error) {
            const message = error.response?.data?.message ||
                "Unable to verify OTP. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const trimmedEmail =
            email.trim().toLowerCase();


        // ================================
        // VALIDATION
        // ================================

        if (!trimmedEmail) {

            toast.error(
                "Please enter your email"
            );

            return;
        }


        if (
            otp.length !== 6
        ) {

            toast.error(
                "Please enter the 6-digit OTP"
            );

            return;
        }


        if (!newPassword) {

            toast.error(
                "Please enter your new password"
            );

            return;
        }


        if (
            newPassword.length < 8
        ) {

            toast.error(
                "Password must be at least 8 characters long"
            );

            return;
        }


        if (
            !/[a-z]/.test(newPassword) ||
            !/[A-Z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[^A-Za-z0-9]/.test(newPassword)
        ) {

            toast.error(
                "Password must contain uppercase, lowercase, number and special character"
            );

            return;
        }


        if (!confirmPassword) {

            toast.error(
                "Please confirm your new password"
            );

            return;
        }


        if (
            newPassword !==
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
                await resetPassword({
                    email:
                        trimmedEmail,

                    otp,

                    newPassword
                });


            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "Password reset failed"
                );
            }


            toast.success(
                "Password reset successfully"
            );


            navigate(
                "/login",
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
                "Unable to reset password. Please try again.";


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
                    BACK
                ========================== */}

                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft
                        size={16}
                    />

                    Back to forgot password
                </Link>


                {/* =========================
                    HEADER
                ========================== */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-lg mb-4">

                        <KeyRound
                            size={25}
                        />

                    </div>


                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Reset your password
                    </h1>


                    <p className="mt-2 text-sm text-slate-500">
                        Enter the OTP and create a new password
                    </p>

                </div>


                {/* =========================
                    CARD
                ========================== */}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-5"
                    >

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
                                    ) => {
                                        setEmail(
                                            event.target.value
                                        );
                                        setOtpVerified(false);
                                    }}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />

                            </div>

                        </div>


                        {/* OTP */}

                        <div>

                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Reset OTP
                            </label>


                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={
                                    handleOtpChange
                                }
                                placeholder="000000"
                                autoComplete="one-time-code"
                                disabled={loading}
                                className="w-full h-14 rounded-xl border border-slate-200 bg-white px-4 text-center text-2xl font-semibold tracking-[0.5em] text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                            />

                        </div>


                        {!otpVerified ? (
                            <button
                                type="button"
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2 transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle size={18} className="animate-spin" />
                                        Verifying OTP...
                                    </>
                                ) : "Verify OTP"}
                            </button>
                        ) : (
                            <>
                        {/* NEW PASSWORD */}

                        <div>

                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                New Password
                            </label>


                            <div className="relative">

                                <KeyRound
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />


                                <input
                                    id="newPassword"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        newPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Create new password"
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
                                Use 8+ characters with uppercase,
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

                                <KeyRound
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
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
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
                                            ? "Hide password"
                                            : "Show password"
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

                                    Resetting password...
                                </>
                            ) : (
                                "Reset password"
                            )}

                        </button>
                            </>
                        )}

                    </form>


                    {/* =========================
                        LOGIN
                    ========================== */}

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">

                        <p className="text-sm text-slate-500">

                            Remember your password?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default ResetPassword;
