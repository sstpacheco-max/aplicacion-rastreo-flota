import React, { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            onLogin();
        } else {
            setError('Credenciales incorrectas. Intente con admin / admin123');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-header">
                    <ShieldCheck size={48} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
                    <h1>Admin Access</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                        Fleet Tracking System v1.0
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>
                </form>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem', textAlign: 'center', marginTop: '2rem' }}>
                    &copy; 2026 Fleet Manager Pro. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default Login;
