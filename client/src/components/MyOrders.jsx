import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrders.css';

const API_URL = 'https://basemotors-api.onrender.com/api';

export const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Cookie отправляется автоматически с withCredentials
            const response = await axios.get(`https://basemotors-api.onrender.com/api/orders/my-orders`, {
                withCredentials: true
            });
            console.log('Orders received:', response.data);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        const statuses = {
            pending: 'В обработке',
            confirmed: 'Подтвержден',
            cancelled: 'Отменен',
            completed: 'Выполнен'
        };
        return statuses[status] || status;
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            confirmed: 'status-confirmed',
            cancelled: 'status-cancelled',
            completed: 'status-completed'
        };
        return classes[status] || '';
    };

    if (loading) return <div className="loading">Загрузка...</div>;

    return (
        <div className="orders-container">
            <h2>Мои заявки</h2>
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>У вас пока нет заявок</p>
                    <p>Перейдите в каталог автомобилей и оформите первую заявку!</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>{order.car_brand} {order.car_model}</h3>
                                <span className={`order-status ${getStatusClass(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                            <div className="order-details">
                                <p><strong>Дата:</strong> {new Date(order.order_date).toLocaleDateString('ru-RU')}</p>
                                <p><strong>ФИО:</strong> {order.last_name} {order.first_name} {order.middle_name || ''}</p>
                                <p><strong>Телефон:</strong> {order.phone}</p>
                                <p><strong>Email:</strong> {order.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};