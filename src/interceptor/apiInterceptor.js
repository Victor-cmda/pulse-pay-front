export function setupInterceptors(axiosInstance, logoutCallback) {
    if (!axiosInstance) {
        return;
    }

    if (axiosInstance.interceptors.response.handlers?.length > 0) {
        axiosInstance.interceptors.response.handlers = [];
    }

    axiosInstance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            if (error.response && error.response.status === 401) {
                console.log("Interceptor: Erro 401 detectado, executando callback de logout");
                if (logoutCallback && typeof logoutCallback === 'function') {
                    logoutCallback();
                }
            }
            return Promise.reject(error);
        }
    );
}
