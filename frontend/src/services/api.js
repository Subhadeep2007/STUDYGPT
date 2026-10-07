import axios from "axios";

const API_URL =
    import.meta.env.VITE_BACKEND_URL;

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

export const getAccessToken = () => {
    return accessToken;
};

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

const refreshClient = axios.create({
    baseURL: API_URL,
    withCredentials: true
});


api.interceptors.request.use(
    (config) => {
        // FormData must keep its multipart body. The browser adds the
        // boundary, so remove the JSON header before Axios transforms it.
        if (
            typeof FormData !== "undefined" &&
            config.data instanceof FormData &&
            config.headers
        ) {
            config.headers.delete("Content-Type");
        }

        if (accessToken) {
            if (!config.headers) {
                config.headers = {};
            }

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response;
    },

    async(error) => {
        if (!error.response ||
            error.response.status !== 401
        ) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || "";

        if (
            requestUrl.includes(
                "/api/auth/refresh-token"
            )
        ) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const refreshResponse =
                await refreshClient.post(
                    "/api/auth/refresh-token"
                );

            const responseData =
                refreshResponse.data;

            if (
                responseData &&
                responseData.success &&
                responseData.data &&
                responseData.data.accessToken
            ) {
                const newAccessToken =
                    responseData.data.accessToken;

                setAccessToken(
                    newAccessToken
                );

                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(
                    originalRequest
                );
            }

            clearAccessToken();

            return Promise.reject(error);
        } catch (refreshError) {
            clearAccessToken();

            return Promise.reject(
                refreshError
            );
        }
    }
);

export default api;
