import axios from "axios";


// ========================================
// AXIOS INSTANCE
// ========================================

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
});


// ========================================
// ACCESS TOKEN
// ========================================

let accessToken = null;


// ========================================
// SET ACCESS TOKEN
// ========================================

const setAccessToken = (token) => {
    accessToken = token;
};


// ========================================
// GET ACCESS TOKEN
// ========================================

const getAccessToken = () => {
    return accessToken;
};


// ========================================
// CLEAR ACCESS TOKEN
// ========================================

const clearAccessToken = () => {
    accessToken = null;
};


// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
    (config) => {

        if (accessToken) {
            config.headers.Authorization =
                `
Bearer $ { accessToken }
`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async(error) => {

        const originalRequest =
            error.config;


        // No response from server
        if (!error.response) {
            return Promise.reject(error);
        }


        // Access token expired
        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;


            // Do not refresh the refresh endpoint itself
            if (
                originalRequest.url &&
                originalRequest.url.includes(
                    "/api/auth/refresh-token"
                )
            ) {
                clearAccessToken();

                return Promise.reject(
                    error
                );
            }


            try {

                const response =
                    await axios.post(
                        `
$ { import.meta.env.VITE_BACKEND_URL }
/api/auth / refresh - token `, {}, {
                            withCredentials: true
                        }
                    );


                if (
                    response.data &&
                    response.data.success &&
                    response.data.data &&
                    response.data.data.accessToken
                ) {

                    const newAccessToken =
                        response.data.data.accessToken;


                    setAccessToken(
                        newAccessToken
                    );


                    originalRequest.headers.Authorization =
                        `
Bearer $ { newAccessToken }
`;


                    return api(
                        originalRequest
                    );
                }


                clearAccessToken();

                return Promise.reject(
                    error
                );

            } catch (refreshError) {

                clearAccessToken();

                return Promise.reject(
                    refreshError
                );
            }
        }


        return Promise.reject(
            error
        );
    }
);


// ========================================
// EXPORT
// ========================================

export {
    setAccessToken,
    getAccessToken,
    clearAccessToken
};


export default api;