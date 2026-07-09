import axios from "axios";

// Create a reusable Axios instance with the backend API base URL
const api = axios.create({

    // All API requests will be prefixed with this URL
    baseURL: "http://localhost:5000/api",

    // Set the default content type for API requests
    headers: {

        "Content-Type": "application/json"

    }

});

// Export the configured Axios instance for use throughout the application
export default api;