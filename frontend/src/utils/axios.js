import axios from 'axios';
import Cookies from "js-cookie";



const apiInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    timeout: 10000,  // 100 seconds, typically 10 seconds is sufficient
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default apiInstance;