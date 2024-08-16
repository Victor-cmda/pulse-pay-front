import axios from "axios";
import { useEffect } from "react";

const useAxiosInterceptors = () => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          console.log("Interceptor acionado", error.response);
          if (error.response && error.response.status === 401) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
};

export default useAxiosInterceptors;
