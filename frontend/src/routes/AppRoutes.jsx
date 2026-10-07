import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";


// ========================================
// PUBLIC PAGES
// ========================================

import Home from "../pages/home/Home.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";


// ========================================
// PROTECTED PAGES
// ========================================

import Chat from "../pages/chat/Chat.jsx";
import Profile from "../pages/profile/profile.jsx";


// ========================================
// LOADING SCREEN
// ========================================

const LoadingScreen = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">

            <div className="flex flex-col items-center gap-4">

                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>

                <p className="text-sm text-gray-500">
                    Loading StudyGPT...
                </p>

            </div>

        </div>
    );
};


// ========================================
// PROTECTED ROUTE
// ========================================

const ProtectedRoute = ({
    children
}) => {

    const {
        loading,
        isAuthenticated
    } = useAuth();


    if (loading) {

        return (
            <LoadingScreen />
        );
    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return children;
};


// ========================================
// PUBLIC ROUTE
// ========================================

const PublicRoute = ({
    children
}) => {

    const {
        loading,
        isAuthenticated
    } = useAuth();


    if (loading) {

        return (
            <LoadingScreen />
        );
    }


    if (isAuthenticated) {

        return (
            <Navigate
                to="/chat"
                replace
            />
        );
    }


    return children;
};


// ========================================
// APP ROUTES
// ========================================

const AppRoutes = () => {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    HOME
                ========================== */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                {/* =========================
                    AUTH ROUTES
                ========================== */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/verify-email"
                    element={
                        <PublicRoute>
                            <VerifyEmail />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotPassword />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/reset-password"
                    element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    }
                />


                {/* =========================
                    PROTECTED ROUTES
                ========================== */}

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat/:chatId"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    404
                ========================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};


export default AppRoutes;