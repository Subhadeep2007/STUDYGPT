import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    loginUser,
    refreshAuthSession,
    logoutUser
} from "../services/auth.service.js";

import {
    setAccessToken,
    clearAccessToken
} from "../services/api.js";


const AuthContext = createContext(null);


export const AuthProvider = ({
    children
}) => {

    const [user, setUser] = useState(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const [loading, setLoading] =
        useState(true);


    const refreshSession = async () => {

        try {

            const response =
                await refreshAuthSession();

            if (
                response &&
                response.success &&
                response.data &&
                response.data.accessToken &&
                response.data.user
            ) {

                setAccessToken(
                    response.data.accessToken
                );

                setUser(
                    response.data.user
                );

                setIsAuthenticated(true);

                return response.data;
            }

            clearAccessToken();

            setUser(null);
            setIsAuthenticated(false);

            return null;

        } catch (error) {

            clearAccessToken();

            setUser(null);
            setIsAuthenticated(false);

            return null;
        }
    };


    const login = async ({
        email,
        password
    }) => {

        const response =
            await loginUser({
                email,
                password
            });


        if (
            response &&
            response.success &&
            response.data &&
            response.data.requiresEmailVerification
        ) {

            return response.data;
        }


        if (
            !response ||
            !response.success ||
            !response.data ||
            !response.data.accessToken ||
            !response.data.user
        ) {

            throw new Error(
                response &&
                response.message
                    ? response.message
                    : "Invalid login response"
            );
        }


        const accessToken =
            response.data.accessToken;

        const loggedInUser =
            response.data.user;


        setAccessToken(
            accessToken
        );

        setUser(
            loggedInUser
        );

        setIsAuthenticated(
            true
        );


        return response.data;
    };


    const logout = async () => {

        try {

            await logoutUser();

        } catch (error) {

            console.error(
                "Logout API error:",
                error
            );

        } finally {

            clearAccessToken();

            setUser(null);

            setIsAuthenticated(false);
        }
    };


    // Profile page se badle hue username/image ko app mein turant dikhaye.
    const updateUser = (userChanges) => {
        setUser((currentUser) => {
            if (!currentUser) {
                return currentUser;
            }

            return {
                ...currentUser,
                ...userChanges
            };
        });
    };


    useEffect(() => {

        const restoreSession =
            async () => {

                setLoading(true);

                await refreshSession();

                setLoading(false);
            };

        restoreSession();

    }, []);


    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
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


export const useAuth = () => {

    return useContext(
        AuthContext
    );
};
