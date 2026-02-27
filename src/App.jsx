import React, { useState, useEffect } from 'react';
import './index.css';
import MapView from './components/MapView';
import FleetDashboard from './components/FleetDashboard';
import Login from './components/Login';
import { generateMockFleet } from './utils/vehicleMock';
import { gpsService } from './utils/gpsService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fleet, setFleet] = useState(generateMockFleet());
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Real-time GPS Tracking
  useEffect(() => {
    if (!isLoggedIn) return;

    const initializeTracking = async () => {
      const hasPermission = await gpsService.requestPermissions();
      if (!hasPermission) return;

      const id = await gpsService.startTracking((pos) => {
        setFleet(prevFleet => {
          // We'll treat the first vehicle as the 'current device' for demo/API integration
          const newFleet = [...prevFleet];
          if (newFleet.length > 0) {
            newFleet[0] = {
              ...newFleet[0],
              location: [pos.lat, pos.lng],
              speed: pos.speed,
              status: pos.speed > 80 ? 'speeding' : 'active',
              lastUpdate: pos.timestamp
            };
          }

          // Keep simulating others but with less aggressive movements
          for (let i = 1; i < newFleet.length; i++) {
            const v = newFleet[i];
            const newLat = v.location[0] + (Math.random() - 0.5) * 0.0005;
            const newLng = v.location[1] + (Math.random() - 0.5) * 0.0005;
            newFleet[i] = { ...v, location: [newLat, newLng] };
          }

          return newFleet;
        });
      });
      setWatchId(id);
    };

    initializeTracking();

    return () => {
      if (watchId) gpsService.stopTracking(watchId);
    };
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedVehicle(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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
