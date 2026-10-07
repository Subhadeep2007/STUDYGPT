import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Brain,
    BookOpen,
    FileText,
    Sparkles,
    BarChart3,
    ShieldCheck,
    MessageCircle,
    CheckCircle2,
    Menu,
    X,
    LogIn,
    UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";


const Home = () => {

    const navigate = useNavigate();

    const {
        isAuthenticated
    } = useAuth();

    const [mobileMenuOpen, setMobileMenuOpen] =
        React.useState(false);


    // ========================================
    // PROTECTED ACTION
    // ========================================

    const handleProtectedAction = (path) => {

        setMobileMenuOpen(false);

        if (isAuthenticated) {
            navigate(path);
            return;
        }

        navigate("/login");
    };


    // ========================================
    // LOGIN
    // ========================================

    const handleLogin = () => {

        setMobileMenuOpen(false);

        navigate("/login");
    };


    // ========================================
    // REGISTER
    // ========================================

    const handleRegister = () => {

        setMobileMenuOpen(false);

        navigate("/register");
    };


    // ========================================
    // NAVIGATION SCROLL
    // ========================================

    const scrollToSection = (id) => {

        setMobileMenuOpen(false);

        const element =
            document.getElementById(id);

        if (element) {

            element.scrollIntoView({
                behavior: "smooth"
            });
        }
    };


    const features = [
        {
            icon: MessageCircle,
            title: "AI Study Chat",
            description:
                "Ask questions and get simple, step-by-step explanations from your AI study assistant.",
            action: () =>
                handleProtectedAction("/chat")
        },
        {
            icon: FileText,
            title: "Study Documents",
            description:
                "Study from your notes, PDFs and learning materials in one place.",
            action: () =>
                handleProtectedAction("/chat")
        },
        {
            icon: BookOpen,
            title: "Exam Preparation",
            description:
                "Get exam-ready answers for short questions, long questions and programming problems.",
            action: () =>
                handleProtectedAction("/chat")
        },
        {
            icon: BarChart3,
            title: "Study Analytics",
            description:
                "Track your learning activity, important topics and study progress.",
            action: () =>
                handleProtectedAction("/chat")
        },
        {
            icon: Brain,
            title: "Smart Learning",
            description:
                "Understand difficult concepts with simple explanations and practical examples.",
            action: () =>
                handleProtectedAction("/chat")
        },
        {
            icon: Sparkles,
            title: "Personalized Help",
            description:
                "Keep your conversations organized and continue learning from previous chats.",
            action: () =>
                handleProtectedAction("/chat")
        }
    ];


    const benefits = [
        "Simple explanations",
        "Exam-ready answers",
        "Programming assistance",
        "Study material support",
        "Conversation history",
        "Responsive on every device"
    ];


    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

            {/* ========================================
                BACKGROUND
            ======================================== */}

            <div className="fixed inset-0 -z-10">

                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full" />

                <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full" />

                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_40%)]" />

            </div>


            {/* ========================================
                NAVBAR
            ======================================== */}

            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="h-16 flex items-center justify-between">

                        {/* LOGO */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            className="flex items-center gap-3 group"
                        >

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">

                                <Brain
                                    size={22}
                                    strokeWidth={2.2}
                                />

                            </div>

                            <div className="text-left">

                                <h1 className="text-lg font-bold tracking-tight">
                                    StudyGPT
                                </h1>

                                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                    AI Study Companion
                                </p>

                            </div>

                        </button>


                        {/* DESKTOP NAV */}

                        <nav className="hidden md:flex items-center gap-8">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                                className="text-sm text-white font-medium hover:text-indigo-300 transition"
                            >
                                Home
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("features")
                                }
                                className="text-sm text-slate-300 hover:text-white transition"
                            >
                                Features
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("why-study-gpt")
                                }
                                className="text-sm text-slate-300 hover:text-white transition"
                            >
                                Why StudyGPT
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("how-it-works")
                                }
                                className="text-sm text-slate-300 hover:text-white transition"
                            >
                                How It Works
                            </button>

                        </nav>


                        {/* DESKTOP ACTIONS */}

                        <div className="hidden md:flex items-center gap-3">

                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleProtectedAction("/chat")
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition shadow-lg"
                                >
                                    Open StudyGPT

                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleLogin}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition"
                                    >
                                        <LogIn size={16} />
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleRegister}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition"
                                    >
                                        <UserPlus size={16} />
                                        Get Started
                                    </button>
                                </>
                            )}

                        </div>


                        {/* MOBILE BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    !mobileMenuOpen
                                )
                            }
                            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                            aria-label="Open menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>

                    </div>

                </div>


                {/* MOBILE MENU */}

                {mobileMenuOpen && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        className="md:hidden border-t border-white/10 bg-slate-950"
                    >

                        <div className="px-4 py-5 space-y-2">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/")
                                }
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition"
                            >
                                Home
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("features")
                                }
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition"
                            >
                                Features
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("why-study-gpt")
                                }
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition"
                            >
                                Why StudyGPT
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    scrollToSection("how-it-works")
                                }
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition"
                            >
                                How It Works
                            </button>


                            <div className="pt-3 border-t border-white/10">

                                {isAuthenticated ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleProtectedAction("/chat")
                                        }
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-950 font-semibold"
                                    >
                                        Open StudyGPT
                                        <ArrowRight size={17} />
                                    </button>

                                ) : (

                                    <div className="grid grid-cols-2 gap-3">

                                        <button
                                            type="button"
                                            onClick={handleLogin}
                                            className="px-4 py-3 rounded-xl border border-white/10 text-sm font-medium"
                                        >
                                            Login
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleRegister}
                                            className="px-4 py-3 rounded-xl bg-white text-slate-950 text-sm font-semibold"
                                        >
                                            Get Started
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    </motion.div>

                )}

            </header>


            {/* ========================================
                HERO
            ======================================== */}

            <main>

                <section className="relative">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-20">

                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                            {/* HERO LEFT */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 25
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.7
                                }}
                            >

                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm mb-6">

                                    <Sparkles size={15} />

                                    AI-powered learning

                                </div>


                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">

                                    Learn smarter.

                                    <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        Study better.
                                    </span>

                                </h2>


                                <p className="mt-6 text-base sm:text-lg text-slate-400 leading-8 max-w-xl">

                                    StudyGPT is your AI study companion for understanding concepts,
                                    solving programming problems, preparing for exams and learning
                                    from your own study material.

                                </p>


                                <div className="mt-8 flex flex-col sm:flex-row gap-3">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleProtectedAction("/chat")
                                        }
                                        className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-semibold shadow-xl shadow-black/20 hover:bg-slate-100 transition"
                                    >

                                        Start Studying

                                        <ArrowRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollToSection("features")
                                        }
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition"
                                    >
                                        Explore Features
                                    </button>

                                </div>


                                <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-400"
                                        />
                                        Simple explanations
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-400"
                                        />
                                        Exam-ready answers
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={16}
                                            className="text-emerald-400"
                                        />
                                        AI assistance
                                    </div>

                                </div>

                            </motion.div>


                            {/* HERO RIGHT */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.96
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.15
                                }}
                                className="relative"
                            >

                                <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 shadow-2xl">

                                    <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden">

                                        {/* MOCK HEADER */}

                                        <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">

                                                    <Brain
                                                        size={19}
                                                        className="text-indigo-400"
                                                    />

                                                </div>

                                                <div>

                                                    <p className="text-sm font-semibold">
                                                        StudyGPT
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        AI Study Assistant
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

                                        </div>


                                        {/* CHAT */}

                                        <div className="p-4 sm:p-5 space-y-5">

                                            <div className="flex justify-end">

                                                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-indigo-500 px-4 py-3 text-sm leading-6">

                                                    Explain stack in DSA in simple language.

                                                </div>

                                            </div>


                                            <div className="flex items-start gap-3">

                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">

                                                    <Sparkles
                                                        size={16}
                                                        className="text-indigo-400"
                                                    />

                                                </div>

                                                <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/5 border border-white/10 px-4 py-3 text-sm leading-7 text-slate-300">

                                                    <p className="font-semibold text-white mb-2">
                                                        Stack
                                                    </p>

                                                    <p>
                                                        A stack is a linear data structure that follows
                                                        the <span className="text-indigo-300 font-medium">LIFO</span>
                                                        principle — Last In, First Out.
                                                    </p>

                                                    <div className="mt-3 grid grid-cols-3 gap-2">

                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-xs">
                                                            Push
                                                        </div>

                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-xs">
                                                            Pop
                                                        </div>

                                                        <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-xs">
                                                            Peek
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* INPUT */}

                                        <div className="p-4 border-t border-white/10">

                                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-500">
                                                Ask StudyGPT anything...
                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* FLOATING CARD */}

                                <motion.div
                                    animate={{
                                        y: [0, -8, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -bottom-5 -left-3 sm:-left-8 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl"
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                                            <ShieldCheck
                                                size={20}
                                                className="text-emerald-400"
                                            />

                                        </div>

                                        <div>

                                            <p className="text-sm font-semibold">
                                                Focus on learning
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Your study, your way
                                            </p>

                                        </div>

                                    </div>

                                </motion.div>

                            </motion.div>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    FEATURES
                ======================================== */}

                <section
                    id="features"
                    className="scroll-mt-20 border-t border-white/5"
                >

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                        <div className="max-w-2xl mx-auto text-center">

                            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-[0.2em]">
                                Features
                            </p>

                            <h3 className="mt-3 text-3xl sm:text-4xl font-bold">
                                Everything you need to study smarter
                            </h3>

                            <p className="mt-4 text-slate-400 leading-7">
                                One place for questions, concepts, programming,
                                exam preparation and your study workflow.
                            </p>

                        </div>


                        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {features.map((feature, index) => {

                                const Icon =
                                    feature.icon;

                                return (
                                    <motion.button
                                        key={feature.title}
                                        type="button"
                                        onClick={feature.action}
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        viewport={{
                                            once: true,
                                            amount: 0.2
                                        }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.05
                                        }}
                                        whileHover={{
                                            y: -5
                                        }}
                                        className="text-left group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-indigo-400/20 transition-all"
                                    >

                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/10 flex items-center justify-center">

                                            <Icon
                                                size={22}
                                                className="text-indigo-400"
                                            />

                                        </div>

                                        <h4 className="mt-5 text-lg font-semibold">
                                            {feature.title}
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-400 leading-6">
                                            {feature.description}
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white">

                                            Open feature

                                            <ArrowRight
                                                size={16}
                                                className="group-hover:translate-x-1 transition-transform"
                                            />

                                        </div>

                                    </motion.button>
                                );
                            })}

                        </div>

                    </div>

                </section>


                {/* ========================================
                    WHY STUDYGPT
                ======================================== */}

                <section
                    id="why-study-gpt"
                    className="scroll-mt-20 border-t border-white/5"
                >

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            <div>

                                <p className="text-sm font-semibold text-indigo-400 uppercase tracking-[0.2em]">
                                    Why StudyGPT
                                </p>

                                <h3 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">
                                    Built for students who want to understand, not just memorize.
                                </h3>

                                <p className="mt-5 text-slate-400 leading-7 max-w-xl">
                                    StudyGPT helps turn difficult concepts into simple,
                                    understandable explanations and keeps your study
                                    conversations organized.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleProtectedAction("/chat")
                                    }
                                    className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-100 transition"
                                >
                                    Start Learning
                                    <ArrowRight size={17} />
                                </button>

                            </div>


                            <div className="grid sm:grid-cols-2 gap-4">

                                {benefits.map((benefit) => (

                                    <div
                                        key={benefit}
                                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                                    >

                                        <div className="flex items-start gap-3">

                                            <CheckCircle2
                                                size={19}
                                                className="text-emerald-400 mt-0.5 shrink-0"
                                            />

                                            <p className="text-sm text-slate-300 leading-6">
                                                {benefit}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    HOW IT WORKS
                ======================================== */}

                <section
                    id="how-it-works"
                    className="scroll-mt-20 border-t border-white/5"
                >

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                        <div className="text-center max-w-2xl mx-auto">

                            <p className="text-sm font-semibold text-indigo-400 uppercase tracking-[0.2em]">
                                How It Works
                            </p>

                            <h3 className="mt-3 text-3xl sm:text-4xl font-bold">
                                Start studying in three simple steps
                            </h3>

                        </div>


                        <div className="mt-12 grid md:grid-cols-3 gap-5">

                            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                                <div className="text-5xl font-black text-white/10">
                                    01
                                </div>

                                <h4 className="mt-3 text-lg font-semibold">
                                    Create your account
                                </h4>

                                <p className="mt-2 text-sm text-slate-400 leading-6">
                                    Register and enter your StudyGPT workspace.
                                </p>

                            </div>


                            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                                <div className="text-5xl font-black text-white/10">
                                    02
                                </div>

                                <h4 className="mt-3 text-lg font-semibold">
                                    Ask anything
                                </h4>

                                <p className="mt-2 text-sm text-slate-400 leading-6">
                                    Ask questions, solve problems or study your materials.
                                </p>

                            </div>


                            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                                <div className="text-5xl font-black text-white/10">
                                    03
                                </div>

                                <h4 className="mt-3 text-lg font-semibold">
                                    Learn and improve
                                </h4>

                                <p className="mt-2 text-sm text-slate-400 leading-6">
                                    Continue your conversations and build a better study workflow.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    CTA
                ======================================== */}

                <section className="border-t border-white/5">

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                        <div className="relative overflow-hidden rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-8 sm:p-12 text-center">

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

                            <div className="relative">

                                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">

                                    <Sparkles
                                        size={26}
                                        className="text-indigo-300"
                                    />

                                </div>

                                <h3 className="mt-6 text-3xl sm:text-4xl font-bold">
                                    Ready to study smarter?
                                </h3>

                                <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-7">
                                    Start your StudyGPT journey and turn your questions
                                    into clear understanding.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleProtectedAction("/chat")
                                    }
                                    className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-semibold hover:bg-slate-100 transition"
                                >
                                    Open StudyGPT
                                    <ArrowRight size={18} />
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* ========================================
                FOOTER
            ======================================== */}

            <footer className="border-t border-white/10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

                                <Brain size={18} />

                            </div>

                            <div>

                                <p className="font-semibold">
                                    StudyGPT
                                </p>

                                <p className="text-xs text-slate-500">
                                    Learn smarter. Study better.
                                </p>

                            </div>

                        </div>


                        <p className="text-xs sm:text-sm text-slate-500 text-center">
                            © {new Date().getFullYear()} StudyGPT. Built for students.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
};


export default Home;