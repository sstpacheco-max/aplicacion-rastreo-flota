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

        const connect = () => {
            console.log('Connecting to fleet tracking cloud...');
            eventSource = new EventSource(`${NTFY_URL}/sse`);

            eventSource.addEventListener('message', (event) => {
                try {
                    const ntfyMsg = JSON.parse(event.data);

                    // ntfyMsg.message is the JSON string sent by the driver
                    if (ntfyMsg.message) {
                        const vehicleData = JSON.parse(ntfyMsg.message);

                        // Use ntfy server time (message.time) as the source of truth
                        // to avoid issues with different device clocks.
                        vehicleData.lastSeenServer = ntfyMsg.time;
                        localFleet[vehicleData.id] = vehicleData;

                        // Filter: only show vehicles active in the last 30 minutes
                        // (ntfyMsg.time provides the current server unix timestamp)
                        const activeVehicles = Object.values(localFleet).filter(v =>
                            (ntfyMsg.time - (v.lastSeenServer || 0)) < 1800
                        );

                        console.log(`Received update from ${vehicleData.id}. Active fleet: ${activeVehicles.length}`);
                        callback(activeVehicles);
                    }
                } catch (e) {
                    console.debug('Received non-vehicle message:', event.data);
                }
            });

            eventSource.addEventListener('open', () => {
                console.log('SSE Connection established successfully.');
            });

            eventSource.addEventListener('error', (e) => {
                console.error('SSE Connection error. Reconnecting in 5s...');
                eventSource.close();
                setTimeout(connect, 5000);
            });
        };

        connect();

        // Return unsubscribe function
        return () => {
            if (eventSource) {
                console.log('Closing fleet subscription.');
                eventSource.close();
            }
        };
    }
};
