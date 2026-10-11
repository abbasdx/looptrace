import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('looptrace_access_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const isPublicImpact =
      error.config?.url?.includes('/impact');

    if (error.response?.status === 401 && !isPublicImpact) {
      sessionStorage.removeItem('looptrace_access_token');
      sessionStorage.removeItem('looptrace_user');

      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 1. Household Services
 * Capabilities: Upload photo for AI, create request, track status, view/verify custody.
 */
export const householdService = {
  // AI Analysis endpoint (handles multipart form data for the image)
  analyzePhoto: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post('/analyze', formData);
    return response.data;
  },

  // Creates a NEW request (Backend will assign it as MATCHED)
  createRequest: async (pickupData) => {
    const payload = {
      householdName: pickupData.householdName || 'Anonymous Household',
      materialCategory: pickupData.materialCategory,
      estimatedWeightKg: parseFloat(pickupData.estimatedWeightKg),
      pickupArea: pickupData.pickupArea,
      latitude: Number(pickupData.latitude),
      longitude: Number(pickupData.longitude),
      weightNote: pickupData.weightNote || null,
      aiResult: pickupData.aiResult || null,
      safetyGuidance: pickupData.safetyGuidance || null,
      photoKey: pickupData.photoKey || null,
    };

    const response = await apiClient.post('/requests', payload);
    return response.data;
  },

  // Track status of a specific request
  getRequests: async () => {
    const response = await apiClient.get('/requests');
    return response.data;
  },

  getRequest: async (id) => {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  },

  // View the custody trail
  getCustodyTrail: async (id) => {
    const response = await apiClient.get(`/requests/${id}/custody`);
    return response.data;
  },

  // Verify the SHA-256 custody chain
  verifyCustody: async (id) => {
    const response = await apiClient.get(`/requests/${id}/custody/verify`);
    return response.data;
  },

  getPhotoUrl: async (key) => {
    const response = await apiClient.get('/photos/presigned', { params: { key } });
    return response.data.url;
  }
};

export const authService = {
  login: async (payload) => (await apiClient.post('/auth/login', payload)).data,
  register: async (payload) => (await apiClient.post('/auth/register', payload)).data,
};

/**
 * 2. Collector Services
 * Capabilities: View assigned, accept, record actual pickup weight, handoff to recycler.
 */
export const collectorService = {
  // Fetch MATCHED or ACCEPTED jobs for a specific collector
  getAssignedJobs: async (collectorId) => {
    const response = await apiClient.get(`/requests?collectorId=${collectorId}`);
    return response.data;
  },

  // Transitions status: MATCHED -> ACCEPTED
  acceptJob: async (requestId, collectorId) => {
    const response = await apiClient.post(`/requests/${requestId}/accept`, { collectorId });
    return response.data;
  },

  // Transitions status: ACCEPTED -> PICKED_UP
  recordPickup: async (requestId, collectorId, actualWeightKg) => {
    const response = await apiClient.post(`/requests/${requestId}/pickup`, { 
      collectorId, 
      actualWeightKg: parseFloat(actualWeightKg) 
    });
    return response.data;
  },

  // Transitions status: PICKED_UP -> HANDED_OFF
  recordHandoff: async (requestId, collectorId, recyclerId, actualWeightKg) => {
    const response = await apiClient.post(`/requests/${requestId}/handoff`, { 
      collectorId, 
      recyclerId, 
      actualWeightKg: parseFloat(actualWeightKg) 
    });
    return response.data;
  }
};

export const pickupService = {
  getAllPickups: async () => {
    const response = await apiClient.get('/requests');
    return response.data;
  },
};

export const recyclerService = {
  getAssignedJobs: async (recyclerId) => {
    const response = await apiClient.get('/requests');
    return response.data.filter(request => request.recyclerId === recyclerId);
  },
  confirmReceipt: async (requestId, recyclerId) =>
    (await apiClient.post(`/requests/${requestId}/recycler/receive`, { recyclerId })).data,
  updateStatus: async (requestId, recyclerId, status) =>
    (await apiClient.patch(`/requests/${requestId}/recycler/status`, { recyclerId, status })).data,
};

export const adminService = {
  dashboard: async () => (await apiClient.get('/admin/dashboard')).data,
  participants: async () => (await apiClient.get('/admin/participants')).data,
  applications: async () => (await apiClient.get('/admin/applications')).data,
  eligibleCollectors: async () => (await apiClient.get('/admin/eligible-collectors')).data,
  eligibleRecyclers: async () => (await apiClient.get('/admin/eligible-recyclers')).data,
  createParticipant: async (payload) => (await apiClient.post('/admin/participants', payload)).data,
  status: async (id, status) => (await apiClient.patch(`/admin/participants/${id}/status`, { status })).data,
  remove: async (id) => apiClient.delete(`/admin/participants/${id}`),
  decide: async (id, approved) => (await apiClient.post(`/admin/applications/${id}/${approved ? 'approve' : 'reject'}`)).data,
  assign: async (id, collectorId) => (await apiClient.post(`/admin/pickups/${id}/assign`, { collectorId })).data,
};

/**
 * 3. Public Dashboard Services
 * Capabilities: Read-only views of impact totals, collectors, and recyclers.
 */
export const publicService = {
  getImpactTotals: async () => {
    const response = await apiClient.get('/impact');
    return response.data;
  },
  
  getCollectors: async () => {
    const response = await apiClient.get('/collectors');
    return response.data;
  },

  getRecyclers: async () => {
    const response = await apiClient.get('/recyclers');
    return response.data;
  }
};

export default {
  household: householdService,
  collector: collectorService,
  recycler: recyclerService,
  pickup: pickupService,
  public: publicService
  ,admin: adminService
  ,auth: authService
};