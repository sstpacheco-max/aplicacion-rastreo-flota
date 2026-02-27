import React, { useState, useEffect } from 'react';
import './index.css';
import MapView from './components/MapView';
import FleetDashboard from './components/FleetDashboard';
import Login from './components/Login';
import { generateMockFleet } from './utils/vehicleMock';
import { gpsService } from './utils/gpsService';

import { apiService } from './utils/api';

function App() {
  const [auth, setAuth] = useState(null); // { username, role }
  const [fleet, setFleet] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // role-based side effects
  useEffect(() => {
    if (!auth) return;

    if (auth.role === 'driver') {
      // DRIVER LOGIC: Follow GPS even in background and push to cloud
      const startDriverTracking = async () => {
        const hasPermission = await gpsService.requestPermissions();
        if (!hasPermission) return;

        const id = await gpsService.startBackgroundTracking((pos) => {
          const driverData = {
            id: auth.username,
            name: `Vehículo: ${auth.username}`,
            driver: auth.username,
            location: [pos.lat, pos.lng],
            speed: pos.speed,
            status: pos.speed > 80 ? 'speeding' : 'active',
            lastUpdate: pos.timestamp
          };
          apiService.updateVehicle(driverData);
          setFleet([driverData]);
        });
        setWatchId(id);
      };
      startDriverTracking();
    } else {
      // ADMIN LOGIC: Subscribe to all cloud updates
      const unsubscribe = apiService.subscribeToFleet((allVehicles) => {
        setFleet(allVehicles); // Only show real data, no more mocks
      });
      return () => unsubscribe();
    }

    return () => {
      if (watchId) {
        if (auth.role === 'driver') gpsService.stopBackgroundTracking(watchId);
        else gpsService.stopTracking(watchId);
      }
    };
  }, [auth]);

  const handleLogin = (userData) => {
    setAuth(userData);
  };

  const handleLogout = () => {
    setAuth(null);
    setFleet([]);
    setSelectedVehicle(null);
  };

  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  // --- Driver View Rendering ---
  if (auth.role === 'driver') {
    return (
      <div className="driver-view app-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
          <h2 style={{ color: 'var(--accent-color)' }}>Tracking Activo</h2>
          <p>Conectado como: <strong>{auth.username}</strong></p>

          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card">
              <span className="label">Velocidad Actual</span>
              <span className="value" style={{ fontSize: '3rem' }}>
                {fleet[0]?.speed || 0}
                <span style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>km/h</span>
              </span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            <p>Tu ubicación está siendo enviada al centro de control en tiempo real.</p>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
            style={{ marginTop: '2rem', width: '100%' }}
          >Detener y Salir</button>
        </div>
      </div>
    );
  }

  // --- Admin Dashboard Rendering ---
  return (
    <div className="app-container">
      <FleetDashboard
        fleet={fleet}
        onSelect={setSelectedVehicle}
        selectedId={selectedVehicle?.id}
        onLogout={handleLogout}
      />
      <div className="map-container">
        <MapView
          fleet={fleet}
          selectedVehicle={selectedVehicle}
        />
      </div>
    </div>
  );
}

export default App;
