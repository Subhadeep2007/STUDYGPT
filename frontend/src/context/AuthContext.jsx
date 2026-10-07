
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api, {
    setAccessToken,
    clearAccessToken
} from "../services/api.js";


const AuthContext =
    createContext(null);


// ========================================
// AUTH PROVIDER
// ========================================

const AuthProvider = ({
    children
}) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);


    // ========================================
    // LOGIN
    // ========================================

    const login = async (
        email,
        password
    ) => {

        const response =
            await api.post(
                "/api/auth/login",
                {
                    email,
                    password
                }
            );


        if (
            !response.data ||
            !response.data.success
        ) {
            throw new Error(
                "Login failed"
            );
        }


        const data =
            response.data.data;


        if (
            !data ||
            !data.accessToken ||
            !data.user
        ) {
            throw new Error(
                "Invalid login response"
            );
        }


        setAccessToken(
            data.accessToken
        );


        setUser(
            data.user
        );


        setIsAuthenticated(
            true
        );


        return data;
    };


    // ========================================
    // REFRESH SESSION
    // ========================================

    const refreshSession = async () => {

        try {

            const response =
                await api.post(
                    "/api/auth/refresh-token"
                );


            if (
                !response.data ||
                !response.data.success
            ) {
                throw new Error(
                    "Session refresh failed"
                );
            }


            const data =
                response.data.data;


            if (
                !data ||
                !data.accessToken ||
                !data.user
            ) {
                throw new Error(
                    "Invalid refresh response"
                );
            }


            setAccessToken(
                data.accessToken
            );


            setUser(
                data.user
            );


            setIsAuthenticated(
                true
            );


            return data;

        } catch (error) {

            clearAccessToken();

            setUser(null);

            setIsAuthenticated(
                false
            );


            return null;
        }
    };


    // ========================================
    // LOGOUT
    // ========================================

    const logout = async () => {

        try {

            await api.post(
                "/api/auth/logout"
            );

        } catch (error) {

            console.error(
                "Logout request failed:",
                error.message
            );

        } finally {

            clearAccessToken();

            setUser(null);

            setIsAuthenticated(
                false
            );
        }
    };


    // ========================================
    // INITIAL SESSION CHECK
    // ========================================

    useEffect(() => {

        const initializeAuth =
            async () => {

                setLoading(true);

                await refreshSession();

                setLoading(false);
            };


        initializeAuth();

    }, []);


    // ========================================
    // CONTEXT VALUE
    // ========================================

    const value = {
        user,
        loading,
        isAuthenticated,

        login,
        logout,
        refreshSession
    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
};


// ========================================
// CUSTOM HOOK
// ========================================

const useAuth = () => {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
};


export {
    AuthProvider,
    useAuth
};


export default AuthContext;
