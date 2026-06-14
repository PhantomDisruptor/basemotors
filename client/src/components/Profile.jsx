import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        phone: user?.phone || ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        if (result.success) {
            setMessage('Профиль успешно обновлен');
            setIsEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Личный кабинет</h2>
                <button onClick={logout} className="logout-button">Выйти</button>
            </div>
            
            {message && <div className="profile-message">{message}</div>}
            
            <div className="profile-info">
                <h3>Личная информация</h3>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={user?.email} disabled />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Сохранить</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Отмена</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <p><strong>Фамилия:</strong> {user?.last_name}</p>
                        <p><strong>Имя:</strong> {user?.first_name}</p>
                        <p><strong>Телефон:</strong> {user?.phone || 'Не указан'}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Редактировать
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};