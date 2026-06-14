import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllCars.css';

const API_URL = 'https://basemotors-api.onrender.com/api';

export function AllCars() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc'); // asc - по возрастанию, desc - по убыванию
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCars();
    }, []);

    useEffect(() => {
        filterAndSortCars();
    }, [cars, sortOrder, searchTerm]);

    const fetchAllCars = async () => {
        try {
            const response = await axios.get(`${API_URL}/cars`);
            setCars(response.data);
            setFilteredCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortCars = () => {
        let filtered = [...cars];
        
        // Фильтрация по поиску
        if (searchTerm) {
            filtered = filtered.filter(car => 
                car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Сортировка по цене
        filtered.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        
        setFilteredCars(filtered);
    };

    const handleCarClick = (car) => {
        navigate(`/car/${car.id}`, { state: { car } });
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (loading) {
        return <div className="loading-cars">Загрузка автомобилей...</div>;
    }

    return (
        <div className="all-cars-container">
            <div className="all-cars-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Вернуться назад
                </button>
                <h1>Все автомобили</h1>
                <div className="cars-count">Найдено: {filteredCars.length} авто</div>
            </div>

            <div className="all-cars-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск по марке или модели..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                
                <button onClick={toggleSortOrder} className="sort-button">
                    {sortOrder === 'asc' ? 'По возрастанию цены ↑' : 'По убыванию цены ↓'}
                </button>
            </div>

            {filteredCars.length === 0 ? (
                <div className="no-cars">
                    <p>Автомобили не найдены</p>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            ) : (
                <div className="all-cars-grid">
                    {filteredCars.map(car => (
                        <div key={car.id} className="car-card" onClick={() => handleCarClick(car)}>
                            <img src={`https://basemotors-api.onrender.com${car.img}`} alt={`${car.brand} ${car.model}`} />
                            <div className="car-info">
                                <h3>{car.brand} {car.model}</h3>
                                <div className="car-specs">
                                    <span className="spec">{car.year} г.</span>
                                    <span className="spec">{car.engine_volume} л</span>
                                    <span className="spec">{car.fuel}</span>
                                    <span className="spec">{car.transmission}</span>
                                </div>
                                <div className="car-price">
                                    {car.price.toLocaleString()} руб.
                                </div>
                                <div className="car-stock">
                                    {car.number_of_cars_in_showroom > 0 ? (
                                        <span className="in-stock">✓ В наличии: {car.number_of_cars_in_showroom} шт.</span>
                                    ) : (
                                        <span className="out-of-stock">✗ Нет в наличии</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}