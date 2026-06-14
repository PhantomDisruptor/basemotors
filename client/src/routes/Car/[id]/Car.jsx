import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Car.css';

const API_URL = 'http://localhost:5000/api';

export function Car() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchCar = async () => {
            // Сначала проверяем, есть ли данные в location.state
            if (location.state?.car) {
                console.log('Car from STATE:', location.state.car);
                console.log('Image from STATE:', location.state.car.img);
                setCar(location.state.car);
                setLoading(false);
                return;
            }
            
            // Если нет, загружаем с сервера
            try {
                const response = await axios.get(`${API_URL}/cars/${id}`);
                console.log('Car from API:', response.data);
                console.log('Image from API:', response.data.img);
                setCar(response.data);
            } catch (error) {
                console.error('Error loading car:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCar();
    }, [id, location.state, navigate]);
    
    const handleSubmit = () => {
        if (car && car.number_of_cars_in_showroom > 0) {
            navigate('/form', { state: { car } });
        }
    };
    
    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }
    
    if (!car) {
        return <div className="error">Автомобиль не найден</div>;
    }
    
    return (
        <main className='car-detail-page'>
            <section className='car-header'>
                <h2>{car.brand} {car.model}</h2>
                <button className='back-button' onClick={() => navigate(-1)}>Вернуться назад</button>
            </section>
            <section className='car-main-card'>
                <div className='car-image'>
                    <img src={`http://localhost:5000${car.img}`} alt={car.model} />
                </div>
                <div className='car-info-panel'>
                <div>        
                    <div className='price-block'>
                         <div className='price-label'>Цена:</div>
                         <div className='price-value'>{car.price.toLocaleString()} руб.</div>
                    </div>
                    <div className='stock-status'>В наличии: {car.number_of_cars_in_showroom}</div>
                    <button 
                    className='buy-button'
                        onClick={handleSubmit} 
                        disabled={car.number_of_cars_in_showroom === 0}
                        >
                        {car.number_of_cars_in_showroom > 0 ? 'Купить' : 'Нет в наличии'}
                    </button>
                </div>
                </div>
            </section>
            <section className='specs-section'>
                <h3>Основные характеристики</h3>
                <table className='specs-table'>
                    <tbody>
                        <tr>
                            <td>Кузов</td>
                            <td>{car.body}</td>
                        </tr>
                        <tr>
                            <td>Тип двигателя</td>
                            <td>{car.fuel}</td>
                        </tr>
                        <tr>
                            <td>Мощность двигателя</td>
                            <td>{car.engine_power} л.с.</td>
                        </tr>
                        <tr>
                            <td>Макс. скорость</td>
                            <td>{car.max_speed} км/ч</td>
                        </tr>
                        <tr>
                            <td>Привод</td>
                            <td>{car.drive}</td>
                        </tr>
                        <tr>
                            <td>Объем багажника</td>
                            <td>{car.trunk_volume} л.</td>
                        </tr>
                        <tr>
                            <td>Объем двигателя</td>
                            <td>{car.engine_volume} л.</td>
                        </tr>
                        <tr>
                            <td>Разгон 0-100 км/ч</td>
                            <td>{car.acceleration_0_100} км/ч</td>
                        </tr>
                        <tr>
                            <td>Расход топлива</td>
                            <td>{car.fuel_consumption} л/100 км</td>
                        </tr>
                        <tr>
                            <td>Кол-во передач</td>
                            <td>{car.number_of_gears}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    );
}