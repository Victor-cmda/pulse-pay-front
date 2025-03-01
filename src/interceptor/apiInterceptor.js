// src/interceptor/apiInterceptor.js

export function setupInterceptors(axiosInstance, logoutCallback) {
    if (!axiosInstance) {
        console.error("Instância Axios não fornecida para setupInterceptors");
        return;
    }

    console.log("Setting up interceptors for instance:", axiosInstance.defaults?.baseURL || "unknown");

    // Remova interceptors anteriores para evitar duplicação
    if (axiosInstance.interceptors.response.handlers?.length > 0) {
        axiosInstance.interceptors.response.handlers = [];
    }

    // Adicione o novo interceptor
    axiosInstance.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            console.log("Interceptor: Erro na resposta", error.response?.status, error.config?.url);

            if (error.response && error.response.status === 401) {
                console.log("Interceptor: Erro 401 detectado, executando callback de logout");
                if (logoutCallback && typeof logoutCallback === 'function') {
                    logoutCallback();
                }
            }
            return Promise.reject(error);
        }
    );

    console.log("Interceptors configurados com sucesso para", axiosInstance.defaults?.baseURL || "unknown");
}
