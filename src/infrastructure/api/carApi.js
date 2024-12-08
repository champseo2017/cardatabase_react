
// API endpoints
const BASE_URL = 'http://localhost:8080/api/v1';

// Helper function for handling responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
};

// Export API functions for React Query
export const carApi = {
  getAllCars: async () => {
    const response = await fetch(`${BASE_URL}/cars`);
    const data = await handleResponse(response);
    return Array.isArray(data) ? data : [];
  },

  getCarById: async (id) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`);
    const data = await handleResponse(response);
    return data;
  },

  searchCars: async (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await fetch(`${BASE_URL}/cars/search?${params}`);
    const data = await handleResponse(response);
    return Array.isArray(data) ? data : [];
  },

  addCar: async (carData) => {
    const response = await fetch(`${BASE_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    return handleResponse(response);
  },

  updateCar: async (id, carData) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    return handleResponse(response);
  },

  deleteCar: async (id) => {
    const response = await fetch(`${BASE_URL}/cars/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete car');
    }
    return true;
  },
}; 