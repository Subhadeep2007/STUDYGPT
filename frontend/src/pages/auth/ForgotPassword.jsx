
import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    LoaderCircle,
    Mail,
    ShieldCheck
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    forgotPassword
} from "../../services/auth.service.js";


const ForgotPassword = () => {

    const navigate =
        useNavigate();


    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const trimmedEmail =
            email.trim().toLowerCase();


        if (!trimmedEmail) {

            toast.error(
                "Please enter your email"
            );

            return;
        }


        try {

            setLoading(true);


            const result =
                await forgotPassword(
                    trimmedEmail
                );


            if (
                !result ||
                !result.success
            ) {

                throw new Error(
                    "Unable to send password reset OTP"
                );
            }


            toast.success(
                "If the account exists, a reset OTP has been sent"
            );


            navigate(
                "/reset-password",
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
                "Unable to process your request. Please try again.";


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
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft
                        size={16}
                    />

                    Back to login
                </Link>


                {/* =========================
                    HEADER
                ========================== */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white shadow-lg mb-4">
                        <ShieldCheck
                            size={25}
                        />
                    </div>


                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Forgot your password?
                    </h1>


                    <p className="mt-2 text-sm text-slate-500">
                        Enter your email and we'll send you a reset OTP
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
                                    ) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your account email"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />

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

                                    Sending OTP...
                                </>
                            ) : (
                                "Send reset OTP"
                            )}

                        </button>

                    </form>


                    {/* =========================
                        INFO
                    ========================== */}

                    <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">

                        <p className="text-xs leading-5 text-slate-500">
                            For security, the server does not reveal whether an email address has an account.
                        </p>

                    </div>


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


                <p className="text-center text-xs text-slate-400 mt-6">
                    Your password reset code will expire shortly.
                </p>

            </div>

        </div>
    );
};


export default ForgotPassword;
