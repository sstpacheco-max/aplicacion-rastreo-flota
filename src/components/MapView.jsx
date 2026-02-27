import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom vehicle icons based on status
const getVehicleIcon = (status) => {
    const color = status === 'speeding' ? '#ef4444' : '#3b82f6';
    const svgIcon = `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="${color}"/>
            </svg>
        `;
    return L.divIcon({
        html: svgIcon,
        className: 'custom-vehicle-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
};

function ChangeView({ center, zoom }) {
    const map = useMap();
    if (center) map.setView(center, zoom);
    return null;
}

const MapView = ({ fleet, selectedVehicle }) => {
    return (
        <MapContainer
            center={[4.6097, -74.0817]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {fleet.map(vehicle => (
                <Marker
                    key={vehicle.id}
                    position={vehicle.location}
                    icon={getVehicleIcon(vehicle.status)}
                >
                    <Popup>
                        <div style={{ color: '#000' }}>
                            <strong>{vehicle.name}</strong><br />
                            Conductor: {vehicle.driver}<br />
                            Velocidad: {vehicle.speed} km/h<br />
                            Placa: {vehicle.plate}
                        </div>
                    </Popup>
                </Marker>
            ))}

            {selectedVehicle && (
                <ChangeView center={selectedVehicle.location} zoom={15} />
            )}
        </MapContainer>
    );
}

export default MapView;

