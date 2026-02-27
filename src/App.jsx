import React, { useState, useEffect } from 'react';
import './index.css';
import MapView from './components/MapView';
import FleetDashboard from './components/FleetDashboard';
import Login from './components/Login';
import { generateMockFleet } from './utils/vehicleMock';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fleet, setFleet] = useState(generateMockFleet());
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      setFleet(prevFleet => prevFleet.map(v => {
        const speedChange = (Math.random() - 0.5) * 10;
        const newSpeed = Math.max(0, Math.min(120, v.speed + speedChange));

        const newLat = v.location[0] + (Math.random() - 0.5) * 0.001;
        const newLng = v.location[1] + (Math.random() - 0.5) * 0.001;

        return {
          ...v,
          speed: Math.round(newSpeed),
          location: [newLat, newLng],
          status: newSpeed > 80 ? 'speeding' : 'active'
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
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
