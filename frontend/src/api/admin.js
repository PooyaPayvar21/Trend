import api from './index';

// Admin Dashboard API
export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin User Management API
export const getAdminUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminUser = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Auction Management API
export const getAdminAuctions = async (params = {}) => {
  try {
    const response = await api.get('/admin/auctions/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminAuction = async (auctionId) => {
  try {
    const response = await api.get(`/admin/auctions/${auctionId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminAuction = async (auctionId, auctionData) => {
  try {
    const response = await api.put(`/admin/auctions/${auctionId}/`, auctionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminAuction = async (auctionId) => {
  try {
    const response = await api.delete(`/admin/auctions/${auctionId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Bid Management API
export const getAdminBids = async (params = {}) => {
  try {
    const response = await api.get('/admin/bids/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminBid = async (bidId) => {
  try {
    const response = await api.get(`/admin/bids/${bidId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminBid = async (bidId, bidData) => {
  try {
    const response = await api.put(`/admin/bids/${bidId}/`, bidData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminBid = async (bidId) => {
  try {
    const response = await api.delete(`/admin/bids/${bidId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Notification Management API
export const getAdminNotifications = async (params = {}) => {
  try {
    const response = await api.get('/admin/notifications/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminNotification = async (notificationId) => {
  try {
    const response = await api.get(`/admin/notifications/${notificationId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminNotification = async (notificationId, notificationData) => {
  try {
    const response = await api.put(`/admin/notifications/${notificationId}/`, notificationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/admin/notifications/${notificationId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Currency Management API
export const getAdminCurrencies = async (params = {}) => {
  try {
    const response = await api.get('/admin/currencies/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminCurrency = async (currencyId) => {
  try {
    const response = await api.get(`/admin/currencies/${currencyId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminCurrency = async (currencyId, currencyData) => {
  try {
    const response = await api.put(`/admin/currencies/${currencyId}/`, currencyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminCurrency = async (currencyId) => {
  try {
    const response = await api.delete(`/admin/currencies/${currencyId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Bulk Actions API
export const adminBulkAction = async (action, modelType, ids) => {
  try {
    const response = await api.post('/admin/bulk-action/', {
      action,
      model_type: modelType,
      ids
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin Export Data API
export const adminExportData = async (modelType, format = 'json') => {
  try {
    const response = await api.get('/admin/export-data/', {
      params: {
        model_type: modelType,
        format
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 