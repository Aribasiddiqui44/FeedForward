// // apiClient.ts
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const apiClient = axios.create({
//   baseURL: 'http://localhost:8000', 
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// apiClient.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('authToken');
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://8177-43-246-225-185.ngrok-free.app',
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;