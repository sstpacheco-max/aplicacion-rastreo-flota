import React from 'react';
import { AlertTriangle, Gauge, Clock, TrendingUp, ChevronLeft, Zap, Shield, Trash2 } from 'lucide-react';

const SpeedDashboard = ({ fleet, speedingLog, speedLimit, onSetLimit, onClearLog }) => {
    const SPEED_LIMITS = {
        city: 60,
        highway: 80
    };

    const totalAlerts = speedingLog.length;
    const activeSpeeders = fleet.filter(v => v.speed > speedLimit);

    const getSpeedLevel = (speed) => {
        if (speed <= speedLimit * 0.7) return { color: 'var(--success)', label: 'Normal', percent: (speed / speedLimit) * 100 };
        if (speed <= speedLimit * 0.9) return { color: 'var(--warning)', label: 'Moderada', percent: (speed / speedLimit) * 100 };
        if (speed <= speedLimit) return { color: '#f59e0b', label: 'Alerta', percent: (speed / speedLimit) * 100 };
        return { color: 'var(--danger)', label: 'EXCESO', percent: 100 };
    };

    return (
        <div className="sidebar-right">
            <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                    <Gauge color="var(--accent-color)" /> Control de Velocidad
                </h2>

                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '3px',
                    border: '1px solid var(--glass-border)',
                    marginTop: '1rem'
                }}>
                    <button onClick={() => onSetLimit(SPEED_LIMITS.city)} style={{
                        flex: 1,
                        padding: '6px',
                        border: 'none',
                        borderRadius: '8px',
                        background: speedLimit === SPEED_LIMITS.city ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                    }}>
                        🏙️ Ciudad
                    </button>
                    <button onClick={() => onSetLimit(SPEED_LIMITS.highway)} style={{
                        flex: 1,
                        padding: '6px',
                        border: 'none',
                        borderRadius: '8px',
                        background: speedLimit === SPEED_LIMITS.highway ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                    }}>
                        🛣️ Carretera
                    </button>
                </div>
            </div>

            <div style={{ padding: '1rem', flexGrow: 1, overflowY: 'auto' }}>
                {/* Compact Stats */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div className="card" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger)' }}>{totalAlerts}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>REPORTES</div>
                    </div>
                    <div className="card" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', marginBottom: 0 }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: activeSpeeders.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                            {activeSpeeders.length}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>EXCESOS VIVO</div>
                    </div>
                </div>

                <h3 style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Monitoreo en Tiempo Real
                </h3>

                {fleet.length === 0 ? (
                    <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>
                        Sin vehículos activos...
                    </div>
                ) : (
                    fleet.map(vehicle => {
                        const level = getSpeedLevel(vehicle.speed || 0);
                        return (
                            <div key={vehicle.id} style={{
                                marginBottom: '0.75rem',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '10px',
                                border: vehicle.speed > speedLimit ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>{vehicle.id}</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem', color: level.color }}>
                                        {vehicle.speed || 0} km/h
                                    </span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(level.percent, 100)}%`, height: '100%', background: level.color, transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        );
                    })
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                        Historial de Excesos
                    </h3>
                    {speedingLog.length > 0 && (
                        <button onClick={onClearLog} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Trash2 size={12} /> Limpiar
                        </button>
                    )}
                </div>

                {speedingLog.length === 0 ? (
                    <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem 1rem', fontSize: '0.8rem' }}>
                        No hay reportes hoy.
                    </div>
                ) : (
                    speedingLog.map(alert => (
                        <div key={alert.id} style={{
                            padding: '0.6rem',
                            marginBottom: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--danger)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                <span style={{ fontWeight: '600' }}>{alert.vehicleId}</span>
                                <span style={{ color: 'var(--danger)', fontWeight: '700' }}>{alert.speed} km/h</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                                <span>Límite: {alert.limit}</span>
                                <span>{alert.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SpeedDashboard;
