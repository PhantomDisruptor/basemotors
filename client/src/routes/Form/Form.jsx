import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

const API_URL = 'https://basemotors-api.onrender.com/api';

export function Form() {
    const navigate = useNavigate();
    const location = useLocation();
    const { car } = location.state || {};
    
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        email: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    lastName: user.last_name || '',
                    firstName: user.first_name || '',
                    email: user.email || '',
                    phone: user.phone || ''
                }));
            } catch(e) {}
        }
    }, []);
    
    if (!car) {
        navigate('/');
        return null;
    }
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
        if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите телефон';
        } else if (!/^[\d\s\+\(\)-]+$/.test(formData.phone)) {
            newErrors.phone = 'Введите корректный номер телефона';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            const orderData = {
                car_id: car.id,
                last_name: formData.lastName,
                first_name: formData.firstName,
                middle_name: formData.middleName,
                phone: formData.phone,
                email: formData.email
            };
            
            // Важно: withCredentials: true для отправки cookie
            const response = await axios.post(`${API_URL}/orders`, orderData, {
                withCredentials: true  // Ключевой момент для cookie!
            });
            
            console.log('Response:', response.data);
            
            setSubmitStatus({ type: 'success', message: 'Заявка успешно отправлена!' });
            
            setTimeout(() => {
                navigate('/my-orders');
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({ 
                type: 'error', 
                message: error.response?.data?.error || 'Ошибка при отправке'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <section className='sec'>
            <div className='ash2'>
                <div className='ash'>
                    <h2>Оформление заявки</h2>
                    <p>Автомобиль: {car.brand} {car.model}</p>
                    <p>Цена: {car.price.toLocaleString()} руб.</p>
                </div>
                <button onClick={() => navigate(-1)}>Вернуться назад</button>
            </div>
            
            {submitStatus && (
                <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                </div>
            )}
            
            <div className='ash3'>
                <input 
                    className="in" 
                    type="text" 
                    name="lastName"
                    placeholder="Фамилия *" 
                    value={formData.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                
                <input 
                    className="in" 
                    type="text" 
                    name="firstName"
                    placeholder="Имя *" 
                    value={formData.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                
                <input 
                    className="in" 
                    type="text" 
                    name="middleName"
                    placeholder="Отчество" 
                    value={formData.middleName}
                    onChange={handleChange}
                />
                
                <input 
                    className="in" 
                    type="tel" 
                    name="phone"
                    placeholder="Телефон *" 
                    value={formData.phone}
                    onChange={handleChange}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
                
                <input 
                    className="in" 
                    type="email" 
                    name="email"
                    placeholder="Почта *" 
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
                
                <button 
                    className="in1" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Отправка...' : 'Отправить форму'}
                </button>
            </div>
        </section>
    );
}