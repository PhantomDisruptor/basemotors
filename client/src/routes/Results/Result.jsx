import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

export function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const { results = [], searchParams = {} } = location.state || {};

    const handleBuyClick = (car) => {
        navigate(`/car/${car.id}`, { state: { car } });
    };

    if (results.length === 0) {
        return (
            <section className="section3">
                <div className='divr'>
                    <h2 className='h2_r'>Результаты поиска</h2>
                    <button onClick={() => navigate(-1)}>Вернуться назад</button>
                </div>
                <div className="no-results">
                    <p>По вашему запросу ничего не найдено</p>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section3">
            <div className='divr'>
                <h2 className='h2_r'>
                    Результаты поиска: найдено {results.length} автомобилей
                </h2>
                <button className='back-button' onClick={() => navigate(-1)}>Вернуться назад</button>
            </div>
            <div>
                <ul className='ul_s'>
                    {results.map((car) => (
                        <li key={car.id} className='li_c'> 
                            <img className='img1' src={`https://basemotors-api.onrender.com/api${car.img}`} alt={car.model} />
                            <h3>{`${car.brand} ${car.model}`}</h3>
                            <div>
                                <p>{`${car.engine_volume} л., ${car.fuel}, ${car.transmission}, ${car.drive}`}</p>
                            </div>
                            <p>Цена: {`${car.price.toLocaleString()} руб.`}</p>
                            <div>
                                <p>Год: {car.year}</p>
                                <p>Цвет кузова: {car.color}</p>
                                <p>В наличии: {car.number_of_cars_in_showroom}</p>
                            </div>
                            <div>
                                <button 
                                    className='btn' 
                                    onClick={() => handleBuyClick(car)}
                                    disabled={car.number_of_cars_in_showroom === 0}
                                >
                                    {car.number_of_cars_in_showroom > 0 ? 'Купить' : 'Нет в наличии'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}