import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://basemotors-api.onrender.com/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Настройка axios для всех запросов
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            const { token: newToken, user: newUser } = response.data;
            
            if (newToken) {
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                setToken(newToken);
                setUser(newUser);
                return { success: true };
            }
            return { success: false, error: 'No token received' };
        } catch (error) {
            console.error('Registration error:', error.response?.data);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Registration failed' 
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token: newToken, user: newUser } = response.data;
            
            console.log('Login response:', { newToken: !!newToken, newUser });
            
            if (newToken) {
                // Сохраняем в localStorage
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                
                // Обновляем состояние
                setToken(newToken);
                setUser(newUser);
                
                // Устанавливаем заголовок для axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                
                console.log('Login successful, token saved');
                return { success: true };
            } else {
                console.error('No token in response');
                return { success: false, error: 'No token received' };
            }
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await axios.put(`${API_URL}/auth/profile`, profileData);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Update failed' 
            };
        }
    };

    const value = {
        user,
        loading,
        token,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};