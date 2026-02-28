import React from 'react';
import { AlertTriangle, Gauge, Clock, TrendingUp, ChevronLeft, Zap, Shield, Trash2 } from 'lucide-react';

const SpeedDashboard = ({ fleet, onBack, speedingLog, speedLimit, onSetLimit, onClearLog }) => {
    // Limits configuration
    const SPEED_LIMITS = {
        city: 60,
        highway: 80
    };

    // Calculate stats
    const totalAlerts = speedingLog.length;
    const activeSpeeders = fleet.filter(v => v.speed > speedLimit);
    const maxSpeed = fleet.length > 0 ? Math.max(...fleet.map(v => v.speed || 0)) : 0;
    const avgSpeed = fleet.length > 0 ? Math.round(fleet.reduce((acc, v) => acc + (v.speed || 0), 0) / fleet.length) : 0;

    // Get speed bar level (for visual gauge)
    const getSpeedLevel = (speed) => {
        if (speed <= speedLimit * 0.7) return { color: 'var(--success)', label: 'Normal', percent: (speed / speedLimit) * 100 };
        if (speed <= speedLimit * 0.9) return { color: 'var(--warning)', label: 'Moderada', percent: (speed / speedLimit) * 100 };
        if (speed <= speedLimit) return { color: '#f59e0b', label: 'Alerta', percent: (speed / speedLimit) * 100 };
        return { color: 'var(--danger)', label: 'EXCESO', percent: 100 };
    };

    return (
        <div className="speed-dashboard" style={{
            height: '100%',
            width: '100%',
            background: 'var(--bg-color)',
            overflow: 'auto',
            padding: '1.5rem'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={onBack} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <ChevronLeft size={16} /> Volver al Mapa
                </button>
                <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <Gauge color="var(--accent-color)" size={28} />
                    Control de Velocidad
                </h1>

                {/* Zone Selector */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '3px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <button onClick={() => onSetLimit(SPEED_LIMITS.city)} style={{
                        padding: '6px 14px',
                        border: 'none',
                        borderRadius: '8px',
                        background: speedLimit === SPEED_LIMITS.city ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}>
                        🏙️ Ciudad (60 km/h)
                    </button>
                    <button onClick={() => onSetLimit(SPEED_LIMITS.highway)} style={{
                        padding: '6px 14px',
                        border: 'none',
                        borderRadius: '8px',
                        background: speedLimit === SPEED_LIMITS.highway ? 'var(--accent-color)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}>
                        🛣️ Vía Nacional (80 km/h)
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ textAlign: 'center', borderLeft: '3px solid var(--accent-color)' }}>
                    <Gauge size={20} color="var(--accent-color)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{maxSpeed}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vel. Máxima (km/h)</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderLeft: '3px solid var(--warning)' }}>
                    <TrendingUp size={20} color="var(--warning)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>{avgSpeed}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vel. Promedio (km/h)</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderLeft: '3px solid var(--danger)' }}>
                    <AlertTriangle size={20} color="var(--danger)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: totalAlerts > 0 ? 'var(--danger)' : 'var(--success)' }}>{totalAlerts}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Registros Históricos</div>
                </div>
                <div className="card" style={{ textAlign: 'center', borderLeft: `3px solid ${activeSpeeders.length > 0 ? 'var(--danger)' : 'var(--success)'}` }}>
                    <Zap size={20} color={activeSpeeders.length > 0 ? 'var(--danger)' : 'var(--success)'} style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: activeSpeeders.length > 0 ? 'var(--danger)' : 'var(--success)' }}>{activeSpeeders.length}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>En Exceso Ahora</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Live Speed Gauges */}
                <div style={{
                    background: 'var(--panel-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '1.5rem'
                }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={18} color="var(--accent-color)" />
                        Monitoreo en Vivo
                    </h3>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                        Límite actual: <strong>{speedLimit} km/h</strong>
                    </div>

                    {fleet.length === 0 ? (
                        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>
                            Esperando datos de la flota...
                        </div>
                    ) : (
                        fleet.map(vehicle => {
                            const level = getSpeedLevel(vehicle.speed || 0);
                            return (
                                <div key={vehicle.id} style={{
                                    marginBottom: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '10px',
                                    border: vehicle.speed > speedLimit ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--glass-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                            🚗 {vehicle.id}
                                        </span>
                                        <span style={{
                                            fontWeight: '700',
                                            fontSize: '1.2rem',
                                            color: level.color
                                        }}>
                                            {vehicle.speed || 0} km/h
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                                        {vehicle.name || 'Sin nombre'}
                                    </div>
                                    {/* Speed Bar */}
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(level.percent, 100)}%`,
                                            height: '100%',
                                            background: level.color,
                                            borderRadius: '4px',
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>0</span>
                                        <span style={{ fontSize: '0.65rem', color: level.color, fontWeight: '600' }}>{level.label}</span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--danger)' }}>{speedLimit}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Records Log */}
                <div style={{
                    background: 'var(--panel-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    padding: '1.5rem',
                    maxHeight: '600px',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <AlertTriangle size={18} color="var(--danger)" />
                            Registros de Excesos
                        </h3>
                        {speedingLog.length > 0 && (
                            <button
                                onClick={onClearLog}
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    color: 'var(--danger)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Trash2 size={12} /> Limpiar
                            </button>
                        )}
                    </div>

                    {speedingLog.length === 0 ? (
                        <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem 1rem' }}>
                            <Shield size={40} color="var(--success)" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
                            No hay infracciones registradas.
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Los excesos de velocidad se guardarán aquí automáticamente.</p>
                        </div>
                    ) : (
                        speedingLog.map(alert => (
                            <div key={alert.id} style={{
                                padding: '0.75rem',
                                marginBottom: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.15)',
                                borderRadius: '10px',
                                borderLeft: '3px solid var(--danger)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                                        🚨 {alert.vehicleId}
                                    </span>
                                    <span style={{
                                        color: 'var(--danger)',
                                        fontWeight: '700',
                                        fontSize: '0.85rem'
                                    }}>
                                        {alert.speed} km/h
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                                    {alert.vehicleName}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem' }}>
                                    <span style={{ color: 'var(--danger)', fontStyle: 'italic' }}>
                                        +{alert.excess} km/h (Límite: {alert.limit})
                                    </span>
                                    <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <Clock size={10} /> {alert.time}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpeedDashboard;
