import React from 'react';
import { Truck, Navigation, AlertTriangle, ShieldCheck, User, MapPin, LogOut } from 'lucide-react';

const FleetDashboard = ({ fleet, onSelect, selectedId, onLogout }) => {
    const speedingCount = fleet.filter(v => v.status === 'speeding').length;

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                    <ShieldCheck color="var(--accent-color)" /> Fleet Manager
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Panel de Administración de Flota
                </p>
            </div>

            <div style={{ padding: '1rem', flexGrow: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="card" style={{ flex: 1, textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{fleet.length}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>TOTAL</div>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center', marginBottom: 0, borderLeft: `3px solid ${speedingCount > 0 ? 'var(--danger)' : 'var(--success)'}` }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: speedingCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                            {speedingCount}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ALERTA</div>
                    </div>
                </div>

                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                    Vehículos Activos
                </h3>

                {fleet.map(vehicle => (
                    <div
                        key={vehicle.id}
                        className={`card ${selectedId === vehicle.id ? 'active-marker' : ''}`}
                        onClick={() => onSelect(vehicle)}
                        style={{
                            cursor: 'pointer',
                            borderLeft: selectedId === vehicle.id ? '3px solid var(--accent-color)' : '1px solid var(--glass-border)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Truck size={16} color={vehicle.status === 'speeding' ? 'var(--danger)' : 'var(--accent-color)'} />
                                    {vehicle.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                                    <User size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    {vehicle.driver} | {vehicle.plate}
                                </div>
                            </div>
                            <span className={`badge ${vehicle.status === 'speeding' ? 'badge-danger' : 'badge-success'}`}>
                                {vehicle.speed} km/h
                            </span>
                        </div>

                        {vehicle.status === 'speeding' && (
                            <div style={{
                                marginTop: '0.75rem',
                                fontSize: '0.75rem',
                                color: 'var(--danger)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <AlertTriangle size={14} /> EXCESO DE VELOCIDAD DETECTADO
                            </div>
                        )}

                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {vehicle.route}
                        </div>
                    </div>
                ))}
            </div>

            <div className="logout-container">
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default FleetDashboard;
