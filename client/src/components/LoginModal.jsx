import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const result = await login(email, password);
        
        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Вход в аккаунт</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <p>
                    Нет аккаунта?{' '}
                    <button onClick={onSwitchToRegister} className="link-button">
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </div>
    );
};