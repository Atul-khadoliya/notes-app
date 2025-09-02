import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://notes-app-pi-six.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;