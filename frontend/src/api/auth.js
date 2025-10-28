import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken
                });
                
                if (response.data.access) {
                    localStorage.setItem('accessToken', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

const authAPI = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login/', {
                email,
                password
            });
            
            if (response.data.access) {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
            }
            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در ورود. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register/', userData);
            
            if (response.data.access) {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
            }
            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در ثبت‌نام. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await api.post('/auth/token/refresh/', {
                refresh: refreshToken
            });
            
            if (response.data.access) {
                localStorage.setItem('accessToken', response.data.access);
            }
            
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    getProfile: async () => {
        try {
            const response = await api.get('/profile/');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.patch('/profile/', profileData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در به‌روزرسانی پروفایل. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    },

    purchaseSubscription: async (subscriptionType) => {
        try {
            const response = await api.post('/subscription/purchase/', {
                subscription_type: subscriptionType
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در خرید اشتراک. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    },

    createAuction: async (auctionData) => {
        try {
            const response = await api.post('/create-auction/', auctionData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در ایجاد مزایده. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    },

    createTender: async (tenderData) => {
        try {
            const response = await api.post('/create-tender/', tenderData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.error || 
                               'خطا در ایجاد مناقصه. لطفا دوباره تلاش کنید.';
            throw { detail: errorMessage };
        }
    }
};

export default authAPI;