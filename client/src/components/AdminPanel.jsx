import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'https://basemotors-api.onrender.com/api';

export const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [cars, setCars] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalCars: 0,
        totalOrders: 0,
        totalUsers: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [showCarForm, setShowCarForm] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        price: '',
        transmission: '',
        drive: '',
        body: '',
        fuel: '',
        engine_volume: '',
        engine_power: '',
        max_speed: '',
        number_of_gears: '',
        acceleration_0_100: '',
        trunk_volume: '',
        fuel_consumption: '',
        number_of_cars_in_showroom: '',
        year: '',
        color: '',
        img: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchData();
        } else {
            setLoading(false);
        }
    }, [activeTab, token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'cars') {
                const response = await axios.get(`${API_URL}/admin/cars`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCars(response.data);
            } else if (activeTab === 'orders') {
                const response = await axios.get(`${API_URL}/admin/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(response.data);
            } else if (activeTab === 'users') {
                const response = await axios.get(`${API_URL}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleAddCar = () => {
        setEditingCar(null);
        setFormData({
            brand: '', model: '', price: '', transmission: '', drive: '',
            body: '', fuel: '', engine_volume: '', engine_power: '',
            max_speed: '', number_of_gears: '', acceleration_0_100: '',
            trunk_volume: '', fuel_consumption: '', number_of_cars_in_showroom: '',
            year: '', color: '', img: ''
        });
        setSelectedImage(null);
        setShowCarForm(true);
    };

    const handleEditCar = (car) => {
        setEditingCar(car);
        setFormData(car);
        setSelectedImage(null);
        setShowCarForm(true);
    };

    const handleSaveCar = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('carData', JSON.stringify(formData));
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            if (editingCar) {
                await axios.put(`${API_URL}/admin/cars/${editingCar.id}`, formDataToSend, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Автомобиль обновлен');
            } else {
                await axios.post(`${API_URL}/admin/cars`, formDataToSend, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Автомобиль добавлен');
            }
            setShowCarForm(false);
            fetchData();
            fetchStats();
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Ошибка при сохранении');
        }
    };

    const handleDeleteCar = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            try {
                await axios.delete(`${API_URL}/admin/cars/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Автомобиль удален');
                fetchData();
                fetchStats();
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Ошибка при удалении');
            }
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/admin/orders/${id}/status`, { status }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Статус заявки обновлен');
            fetchData();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Ошибка при обновлении статуса');
        }
    };

    if (!token) {
        return <div className="admin-panel">Вы не авторизованы</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Админ-панель</h1>
            
            {/* Статистика */}
            <div className="admin-stats">
                <div className="stat-card"><h3>Автомобилей</h3><p>{stats.totalCars}</p></div>
                <div className="stat-card"><h3>Заявок</h3><p>{stats.totalOrders}</p></div>
                <div className="stat-card"><h3>Пользователей</h3><p>{stats.totalUsers}</p></div>
                <div className="stat-card"><h3>Новых заявок</h3><p>{stats.pendingOrders}</p></div>
            </div>

            {/* Вкладки */}
            <div className="admin-tabs">
                <button className={activeTab === 'cars' ? 'active' : ''} onClick={() => setActiveTab('cars')}>
                    Автомобили
                </button>
                <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                    Заявки
                </button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                    Пользователи
                </button>
            </div>

            {/* Форма добавления/редактирования автомобиля */}
            {showCarForm && (
                <div className="car-form-modal">
                    <div className="car-form-content">
                        <h2>{editingCar ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h2>
                        <div className="form-grid">
                            <input name="brand" placeholder="Марка" value={formData.brand} onChange={handleInputChange} />
                            <input name="model" placeholder="Модель" value={formData.model} onChange={handleInputChange} />
                            <input name="price" type="number" placeholder="Цена" value={formData.price} onChange={handleInputChange} />
                            <input name="transmission" placeholder="КПП" value={formData.transmission} onChange={handleInputChange} />
                            <input name="drive" placeholder="Привод" value={formData.drive} onChange={handleInputChange} />
                            <input name="body" placeholder="Кузов" value={formData.body} onChange={handleInputChange} />
                            <input name="fuel" placeholder="Топливо" value={formData.fuel} onChange={handleInputChange} />
                            <input name="engine_volume" type="number" step="0.1" placeholder="Объем двигателя" value={formData.engine_volume} onChange={handleInputChange} />
                            <input name="engine_power" type="number" placeholder="Мощность" value={formData.engine_power} onChange={handleInputChange} />
                            <input name="max_speed" type="number" placeholder="Макс скорость" value={formData.max_speed} onChange={handleInputChange} />
                            <input name="number_of_gears" type="number" placeholder="Кол-во передач" value={formData.number_of_gears} onChange={handleInputChange} />
                            <input name="acceleration_0_100" type="number" step="0.1" placeholder="Разгон 0-100" value={formData.acceleration_0_100} onChange={handleInputChange} />
                            <input name="trunk_volume" type="number" placeholder="Объем багажника" value={formData.trunk_volume} onChange={handleInputChange} />
                            <input name="fuel_consumption" type="number" step="0.1" placeholder="Расход топлива" value={formData.fuel_consumption} onChange={handleInputChange} />
                            <input name="number_of_cars_in_showroom" type="number" placeholder="Количество в наличии" value={formData.number_of_cars_in_showroom} onChange={handleInputChange} />
                            <input name="year" type="number" placeholder="Год" value={formData.year} onChange={handleInputChange} />
                            <input name="color" placeholder="Цвет" value={formData.color} onChange={handleInputChange} />
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="form-actions">
                            <button onClick={handleSaveCar}>Сохранить</button>
                            <button onClick={() => setShowCarForm(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Автомобили */}
            {!loading && activeTab === 'cars' && (
                <div>
                    <button className="add-button" onClick={handleAddCar}>+ Добавить автомобиль</button>
                    <table className="admin-table">
                        <thead>
                            <tr><th>ID</th><th>Марка</th><th>Модель</th><th>Цена</th><th>В наличии</th><th>Действия</th></tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id}>
                                    <td>{car.id}</td><td>{car.brand}</td><td>{car.model}</td>
                                    <td>{car.price?.toLocaleString()} руб.</td><td>{car.number_of_cars_in_showroom}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEditCar(car)}>✏️</button>
                                        <button className="delete-btn" onClick={() => handleDeleteCar(car.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Заявки */}
            {!loading && activeTab === 'orders' && (
                <table className="admin-table">
                    <thead><tr><th>ID</th><th>Автомобиль</th><th>Клиент</th><th>Статус</th><th>Действия</th></tr></thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td><td>{order.car_brand} {order.car_model}</td>
                                <td>{order.last_name} {order.first_name}</td>
                                <td>
                                    <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}>
                                        <option value="pending">В обработке</option>
                                        <option value="confirmed">Подтвержден</option>
                                        <option value="completed">Выполнен</option>
                                        <option value="cancelled">Отменен</option>
                                    </select>
                                </td>
                                <td><button className="confirm-btn" onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}>✓</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Пользователи */}
            {!loading && activeTab === 'users' && (
                <table className="admin-table">
                    <thead><tr><th>ID</th><th>Email</th><th>Имя</th><th>Роль</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td><td>{user.email}</td>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};