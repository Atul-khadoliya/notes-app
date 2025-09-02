import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://notes-api-atulkhadoliya.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;