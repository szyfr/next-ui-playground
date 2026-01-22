import axios, { type AxiosError } from "axios";

// Enable credentials and XSRF token handling globally
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log errors for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout or redirect
      console.warn("Unauthorized request");
    }

    if (error.response?.status === 419) {
      // CSRF token mismatch - could retry after refreshing token
      console.warn("CSRF token mismatch");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
