/**
 * API Service - Real-Time Sync via ntfy.sh
 * 
 * ntfy.sh is a free, zero-config push notification service.
 * Driver POSTS location data → ntfy.sh relays it instantly → Admin receives via SSE stream.
 * Works in ANY browser with simple fetch() calls.
 */

const CHANNEL = 'fleet_pacheco_rastreo_2026';
const NTFY_URL = `https://ntfy.sh/${CHANNEL}`;

export const apiService = {
    /**
     * Driver: Send vehicle position to the cloud
     */
    updateVehicle: async (vehicleData) => {
        try {
            const payload = JSON.stringify({
                ...vehicleData,
                lastSeen: Date.now()
            });

            await fetch(NTFY_URL, {
                method: 'POST',
                body: payload,
                headers: {
                    'Title': `Vehicle ${vehicleData.id}`,
                    'Tags': 'car'
                }
            });
        } catch (e) {
            console.error('Error sending position:', e);
        }
    },

    /**
     * Admin: Subscribe to real-time vehicle updates via Server-Sent Events (SSE)
     */
    subscribeToFleet: (callback) => {
        const localFleet = {};
        let eventSource = null;

        try {
            // SSE stream - receives messages in real-time as they arrive
            eventSource = new EventSource(`${NTFY_URL}/sse`);

            eventSource.onmessage = (event) => {
                try {
                    const ntfyMsg = JSON.parse(event.data);
                    if (ntfyMsg.message) {
                        const vehicleData = JSON.parse(ntfyMsg.message);
                        localFleet[vehicleData.id] = vehicleData;

                        // Filter: only vehicles active in last 10 minutes (more lenient for mobile signals)
                        const activeVehicles = Object.values(localFleet).filter(v =>
                            (Date.now() - (v.lastSeen || 0)) < 600000
                        );
                        callback(activeVehicles);
                    }
                } catch (e) {
                    // Ignore non-JSON messages
                }
            };

            eventSource.onerror = (e) => {
                console.error('SSE connection error, will auto-reconnect...');
            };
        } catch (e) {
            console.error('Error setting up SSE:', e);
        }

        // Return unsubscribe function
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }
};
