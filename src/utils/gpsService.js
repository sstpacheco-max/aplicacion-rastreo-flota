import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core';

const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

/**
 * Service to handle device GPS tracking (Foreground and Background)
 */
export const gpsService = {
    /**
     * Request permissions for Geolocation (including background)
     */
    requestPermissions: async () => {
        try {
            const status = await Geolocation.requestPermissions();
            // Note: For background tracking on Android 10+, 
            // the user must manually select "Allow all the time" in settings.
            return status.location === 'granted';
        } catch (error) {
            console.error('Error requesting GPS permissions:', error);
            return false;
        }
    },

    /**
     * Start background tracking
     * @param {Function} callback - Function called on every position change
     */
    startBackgroundTracking: async (callback) => {
        try {
            const watcherId = await BackgroundGeolocation.addWatcher(
                {
                    backgroundMessage: "Rastreo de flota activo en segundo plano",
                    backgroundTitle: "Fleet Tracking Pro",
                    requestPermissions: true,
                    stale: false,
                    distanceFilter: 10 // metros
                },
                (location, error) => {
                    if (error) {
                        if (error.code === "NOT_AUTHORIZED") {
                            console.error("The user has not allowed the app to access its location.");
                        }
                        return;
                    }
                    if (location) {
                        callback({
                            lat: location.latitude,
                            lng: location.longitude,
                            speed: Math.round((location.speed || 0) * 3.6),
                            timestamp: location.time
                        });
                    }
                }
            );
            return watcherId;
        } catch (error) {
            console.error('Error starting background tracking:', error);
            return null;
        }
    },

    /**
     * Stop background tracking
     */
    stopBackgroundTracking: async (watcherId) => {
        if (watcherId) {
            await BackgroundGeolocation.removeWatcher({ id: watcherId });
        }
    },

    /**
     * Watch position for real-time updates (Legacy/Simple)
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
                        speed: Math.round((position.coords.speed || 0) * 3.6),
                        timestamp: position.timestamp
                    });
                }
            }
        );
        return watchId;
    },

    /**
     * Stop tracking
     */
    stopTracking: async (watchId) => {
        if (watchId) {
            await Geolocation.clearWatch({ id: watchId });
        }
    }
};
