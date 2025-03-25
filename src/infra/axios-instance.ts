import axios, { AxiosInstance } from "axios";

// No Next.js, a API é servida em /api por padrão

// const BASE_URL: string = 'http://localhost:3000/api';
const BASE_URL: string = '/api';
const ainst: AxiosInstance = axios.create({
    baseURL: BASE_URL, // URL relativa para funcionar tanto em dev quanto prod
    headers: {
        'Content-Type': 'application/json'
    }
});

export default ainst;
