import { Geolocation } from '@capacitor/geolocation';

/**
 * Service to handle device GPS tracking
 */
export const gpsService = {
    /**
     * Request permissions for Geolocation
     */
    requestPermissions: async () => {
        try {
            const status = await Geolocation.requestPermissions();
            return status.location === 'granted';
        } catch (error) {
            console.error('Error requesting GPS permissions:', error);
            return false;
        }
    },

    /**
     * Get current device position once
     */
    getCurrentPosition: async () => {
        try {
            const coordinates = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true
            });
            return {
                lat: coordinates.coords.latitude,
                lng: coordinates.coords.longitude,
                speed: coordinates.coords.speed || 0,
                timestamp: coordinates.timestamp
            };
        } catch (error) {
            console.error('Error getting current position:', error);
            return null;
        }
    },

    /**
     * Watch position for real-time updates
     * @param {Function} callback - Function called on every position change
     */
    startTracking: async (callback) => {
        const watchId = await Geolocation.watchPosition(
            {
                enableHighAccuracy: true,
                timeout: 10000
            },
            (position, err) => {
                if (err) {
                    console.error('Error watching position:', err);
                    return;
                }
                if (position) {
                    callback({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        speed: Math.round((position.coords.speed || 0) * 3.6), // Convert m/s to km/h
                        timestamp: position.timestamp
                    });
                }
            }
        );
        return watchId;
    },

    /**
     * Stop tracking
     * @param {string} watchId 
     */
    stopTracking: async (watchId) => {
        if (watchId) {
            await Geolocation.clearWatch({ id: watchId });
        }
    }
};
