/**
 * Simple API service for data synchronization.
 * In a real-world scenario, this would connect to a backend like Firebase, Supabase, or a Node.js API.
 */

// Simulated cloud database (stored in localStorage for persistence across tabs/users for demo)
const CLOUD_STORAGE_KEY = 'fleet_cloud_data';

const getCloudData = () => {
    const data = localStorage.getItem(CLOUD_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

const saveCloudData = (data) => {
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(data));
};

export const apiService = {
    /**
     * Update a vehicle's position in the "cloud"
     */
    updateVehicle: async (vehicleData) => {
        const cloudData = getCloudData();
        cloudData[vehicleData.id] = {
            ...vehicleData,
            lastSeen: new Date().toISOString()
        };
        saveCloudData(cloudData);
        return true;
    },

    /**
     * Fetch all vehicles from the "cloud"
     */
    fetchAllVehicles: async () => {
        const cloudData = getCloudData();
        return Object.values(cloudData);
    },

    /**
     * Subscribe to updates (simulating a WebSocket or long polling)
     */
    subscribeToFleet: (callback) => {
        const interval = setInterval(async () => {
            const data = await apiService.fetchAllVehicles();
            callback(data);
        }, 3000);
        return () => clearInterval(interval);
    }
};
