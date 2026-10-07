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
    Mail
} from "lucide-react";

import {
    toast
} from "sonner";

import {
    useAuth
} from "../../context/AuthContext.jsx";


const Login = () => {

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
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


        if (!email.trim()) {
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


        try {

            setLoading(true);


            await login(
                email.trim(),
                password
            );


            toast.success(
                "Login successful"
            );


            navigate(
                "/chat",
                {
                    replace: true
                }
            );

        } catch (error) {

            let message =
                "Unable to login. Please try again.";

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
                error.response.data.data
            ) {

                const data =
                    error.response.data.data;


                if (
                    data.requiresEmailVerification
                ) {

                    toast.info(
                        "Please verify your email first."
                    );


                    navigate(
                        "/verify-email",
                        {
                            state: {
                                email:
                                    data.email
                            }
                        }
                    );


                    return;
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
                        Welcome to StudyGPT
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to continue learning
                    </p>

                </div>


                {/* =========================
                    LOGIN CARD
                ========================== */}

                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8">

                    <form
                        onSubmit={handleSubmit}
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
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-slate-900 hover:underline"
                                >
                                    Forgot password?
                                </Link>

                            </div>


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
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
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

                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}

                        </button>

                    </form>


                    {/* =========================
                        REGISTER
                    ========================== */}

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">

                        <p className="text-sm text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-slate-900 hover:underline"
                            >
                                Create account
                            </Link>

                        </p>

                    </div>

                </div>


                <p className="text-center text-xs text-slate-400 mt-6">
                    Your AI-powered study assistant
                </p>

            </div>

        </div>
    );
};


export default Login;