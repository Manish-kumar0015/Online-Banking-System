import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Create a reusable Axios instance with the backend API base URL
const api = axios.create({

    // All API requests will be prefixed with this URL
    baseURL: API_URL,

    // Set the default content type for API requests
    headers: {

        "Content-Type": "application/json"

    }

});

// Export the configured Axios instance for use throughout the application
export default api;