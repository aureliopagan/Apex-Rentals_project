import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const assetsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return api.get(`/assets?${params}`);
  },
  getById: (id) => api.get(`/assets/${id}`),
  create: (assetData) => api.post('/assets', assetData),
  update: (id, assetData) => api.put(`/assets/${id}`, assetData),
  delete: (id) => api.delete(`/assets/${id}`),
  getMyAssets: () => api.get('/assets/my-assets'),
};

export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  checkAvailability: (assetId, startDate, endDate) => 
    api.get(`/bookings/asset/${assetId}/availability?start_date=${startDate}&end_date=${endDate}`),
};

export const reviewsAPI = {
  create: (reviewData) => api.post('/reviews', reviewData),
  getAssetReviews: (assetId) => api.get(`/reviews/asset/${assetId}`),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  checkEligibility: (bookingId) => api.get(`/reviews/booking/${bookingId}/eligible`),
};

export default api;