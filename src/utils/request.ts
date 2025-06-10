import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT, MESSAGES } from '../config.js';

// Create axios instance
const request: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
request.interceptors.request.use(
    (config) => {
        // console.error('request', config);
        // Add request preprocessing logic here, such as adding unified request headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor
request.interceptors.response.use(
    (response) => {
        process.env.DEBUG_LOG === 'true' && console.error('api response', response.data);
        return response;
    },
    (error) => {
        console.error('error', error);
        // Unified error handling
        let errMsg = 'Network request failed';
        if (error.response) {
            // Request sent, server returned status code not in 2xx range
            errMsg = `${error.response.status} ${error.response.statusText}`;
        } else if (error.request) {
            // Request sent but no response received
            errMsg = MESSAGES.common_error;
        } else {
            // Request configuration error
            errMsg = MESSAGES.common_error;
        }
        console.error('Request failed:', errMsg);
        return Promise.reject(new Error(errMsg));
    }
);

export default request; 