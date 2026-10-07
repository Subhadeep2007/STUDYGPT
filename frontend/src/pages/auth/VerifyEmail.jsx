
import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    LoaderCircle,
    MailCheck
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    verifyEmail,
    resendVerificationOTP
} from "../../services/auth.service.js";


const VerifyEmail = () => {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    // ========================================
    // EMAIL
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


    const [loading, setLoading] =
        useState(false);


    const [resendLoading, setResendLoading] =
        useState(false);


    const [countdown, setCountdown] =
        useState(60);


    // ========================================
    // COUNTDOWN
    // ========================================

    useEffect(() => {

        if (countdown <= 0) {
            return;
        }


        const timer =
            setTimeout(() => {

                setCountdown(
                    countdown - 1
                );

            }, 1000);


        return () => {
            clearTimeout(timer);
        };

    }, [countdown]);


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
        }
    };


    // ========================================
    // VERIFY OTP
    // ========================================

    const handleVerify = async (
        event
    ) => {

        event.preventDefault();


        if (!email.trim()) {

            toast.error(
                "Email is required"
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


        try {

            setLoading(true);


            const result =
                await verifyEmail({
                    email:
                        email.trim().toLowerCase(),

                    otp
                });


            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "Email verification failed"
                );
            }


            toast.success(
                "Email verified successfully"
            );


            navigate(
                "/login",
                {
                    replace: true,

                    state: {
                        email:
                            email.trim().toLowerCase()
                    }
                }
            );

        } catch (error) {

            let message =
                "Unable to verify email. Please try again.";


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


    // ========================================
    // RESEND OTP
    // ========================================

    const handleResend = async () => {

        if (!email.trim()) {

            toast.error(
                "Email is required"
            );

            return;
        }


        if (
            countdown > 0
        ) {

            return;
        }


        try {

            setResendLoading(
                true
            );


            const result =
                await resendVerificationOTP(
                    email.trim().toLowerCase()
                );


            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "Unable to resend OTP"
                );
            }


            setOtp("");

            setCountdown(60);


            toast.success(
                "New verification OTP sent"
            );

        } catch (error) {

            let message =
                "Unable to resend OTP. Please try again.";


            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                message =
                    error.response.data.message;
            }


            toast.error(
                message
            );

        } finally {

            setResendLoading(
                false
            );
        }
    };


    // ========================================
    // EMAIL CHANGE
    // ========================================

    const handleEmailChange = (
        event
    ) => {

        setEmail(
            event.target.value
        );
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-md">

                {/* =========================
                    BACK
                ========================== */}

                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft
                        size={16}
                    />

                    Back to registration
                </Link>


                {/* =========================
                    HEADER
                ========================== */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-lg mb-4">
                        <MailCheck
                            size={25}
                        />
                    </div>


                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Verify your email
                    </h1>


                    <p className="mt-2 text-sm text-slate-500">
                        Enter the 6-digit OTP sent to your email
                    </p>

                </div>


                {/* =========================
                    CARD
                ========================== */}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                    <form
                        onSubmit={
                            handleVerify
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


                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={
                                    handleEmailChange
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                            />

                        </div>


                        {/* OTP */}

                        <div>

                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Verification OTP
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

                            <p className="mt-2 text-xs text-slate-400 text-center">
                                OTP is valid for 10 minutes.
                            </p>

                        </div>


                        {/* VERIFY BUTTON */}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                otp.length !== 6
                            }
                            className="w-full h-12 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2 transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Verifying...
                                </>
                            ) : (
                                "Verify email"
                            )}

                        </button>

                    </form>


                    {/* =========================
                        RESEND
                    ========================== */}

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">

                        <p className="text-sm text-slate-500">

                            Didn't receive the OTP?

                        </p>


                        {countdown > 0 ? (
                            <p className="mt-2 text-sm text-slate-400">
                                Resend available in{" "}
                                <span className="font-semibold text-slate-700">
                                    {countdown}s
                                </span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={
                                    handleResend
                                }
                                disabled={
                                    resendLoading
                                }
                                className="mt-2 text-sm font-semibold text-slate-900 hover:underline disabled:opacity-50"
                            >
                                {resendLoading
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>
                        )}

                    </div>


                    {/* =========================
                        LOGIN
                    ========================== */}

                    <div className="mt-5 text-center">

                        <p className="text-sm text-slate-500">

                            Already verified?{" "}

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
                    Keep your verification code private.
                </p>

            </div>

        </div>
    );
};


export default VerifyEmail;
