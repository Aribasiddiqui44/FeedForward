// apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://90f8-113-203-200-187.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;