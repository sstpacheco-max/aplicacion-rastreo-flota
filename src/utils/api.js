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

            // Using simple fetch to avoid preflight issues if possible
            await fetch(NTFY_URL, {
                method: 'POST',
                body: payload
            });
            console.log(`Sync: Update sent for ${vehicleData.id}`);
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

        const connect = () => {
            console.log('Connecting to fleet tracking cloud...');
            // poll=1: Returns the last message immediately upon connection
            eventSource = new EventSource(`${NTFY_URL}/sse?poll=1`);

            eventSource.addEventListener('message', (event) => {
                try {
                    const ntfyMsg = JSON.parse(event.data);

                    if (ntfyMsg.message) {
                        const vehicleData = JSON.parse(ntfyMsg.message);
                        vehicleData.lastSeenServer = ntfyMsg.time;
                        localFleet[vehicleData.id] = vehicleData;

                        // Filter: only show vehicles active in the last 1 hour (3600s)
                        // This accounts for intermittent network issues better than 30m.
                        const activeVehicles = Object.values(localFleet).filter(v =>
                            (ntfyMsg.time - (v.lastSeenServer || 0)) < 3600
                        );

                        console.log(`Cloud update: ${vehicleData.id}. Active fleet: ${activeVehicles.length}`);
                        callback(activeVehicles);
                    }
                } catch (e) {
                    // Ignore non-json or system messages
                }
            });

            eventSource.addEventListener('open', () => {
                console.log('Fleet cloud connection established.');
            });

            eventSource.addEventListener('error', (e) => {
                console.error('Connection lost. Retrying...');
                eventSource.close();
                setTimeout(connect, 5000);
            });
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }
};
