import { useState, useEffect } from 'react';
import './Glavnaya.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = '/api';
export function Glavnaya() {
    let [selectedBrand,setSelectedBrand] = useState('')
    let [selectedModel,setSelectedModel] = useState('')
    let [selectedMinPrice,setSelectedMinPrice] = useState(0)
    let [selectedMaxPrice,setSelectedMaxPrice] = useState(0)
    let [selectedKPP,setSelectedKPP] = useState('')
    let [selectedPrivod,setSelectedPrivod] = useState('')
    let [selectedKyzov,setSelectedKyzov] = useState('')
    let [selectedToplivo,setSelectedToplivo] = useState('')
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        transmissions: [],
        drives: [],
        bodies: [],
        fuels: []
    });
    
    useEffect(() => {
        // Загружаем марки
        axios.get(`${API_URL}/filters/brands`)
            .then(response => setBrands(response.data))
            .catch(error => console.error('Error loading brands:', error));
        
        // Загружаем опции для фильтров
        axios.get(`${API_URL}/filters/options`)
            .then(response => setFilterOptions(response.data))
            .catch(error => console.error('Error loading filter options:', error));
    }, []);
    
    useEffect(() => {
        if (selectedBrand) {
            axios.get(`${API_URL}/filters/models/${selectedBrand}`)
                .then(response => setModels(response.data))
                .catch(error => console.error('Error loading models:', error));
        } else {
            setModels([]);
        }
        setSelectedModel('');
    }, [selectedBrand]);
    
    const handleChangeBrand = (e) => {
        setSelectedBrand(e.target.value);
    };
    
    const handleChangeModel = (e) => {
        setSelectedModel(e.target.value);
    };
    
    const handleChangeMinPrice = (e) => {
        setSelectedMinPrice(e.target.value);
    };
    
    const handleChangeMaxPrice = (e) => {
        setSelectedMaxPrice(e.target.value);
    };
    
    const handleChangeKPP = (e) => {
        setSelectedKPP(e.target.value);
    };
    
    const handleChangePrivod = (e) => {
        setSelectedPrivod(e.target.value);
    };
    
    const handleChangeKyzov = (e) => {
        setSelectedKyzov(e.target.value);
    };
    
    const handleChangeToplivo = (e) => {
        setSelectedToplivo(e.target.value);
    };
    
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        const searchParams = {
            brand: selectedBrand,
            model: selectedModel,
            min_price: selectedMinPrice ? parseInt(selectedMinPrice) : 0,
            max_price: selectedMaxPrice ? parseInt(selectedMaxPrice) : 0,
            transmission: selectedKPP,
            drive: selectedPrivod,
            body: selectedKyzov,
            fuel: selectedToplivo
        };
        
        try {
            const response = await axios.post(`${API_URL}/filters/search`, searchParams);
            navigate('/result', { state: { results: response.data, searchParams } });
        } catch (error) {
            console.error('Search error:', error);
        }
    };
    
    
     return (
        <>
            <section className='section1' id="cars">
                <h2 className='h2_e'>Подбор автомобиля</h2>
                <div className='div2'>
                    <div className='div3'>
                        <select className='select1' value={selectedBrand} onChange={handleChangeBrand}>
                            <option value=''>Марка</option>
                            {brands.map((brand, index) => (
                                <option key={index} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <select className='select1' value={selectedModel} onChange={handleChangeModel} disabled={!selectedBrand}>
                            <option value=''>Модель</option>
                            {models.map((model, index) => (
                                <option key={index} value={model}>{model}</option>
                            ))}
                        </select>
                        <div>
                            <input className="input1" type="number" placeholder='Цена от' onChange={handleChangeMinPrice} />
                            <input className="input1" type="number" placeholder='Цена до' onChange={handleChangeMaxPrice} />
                        </div>
                    </div>
                    <div className='div4'>
                        <select className='select2' value={selectedKPP} onChange={handleChangeKPP}>
                            <option value=''>КПП</option>
                            {filterOptions.transmissions.map((trans, index) => (
                                <option key={index} value={trans}>{trans}</option>
                            ))}
                        </select>
                        <select className='select2' value={selectedPrivod} onChange={handleChangePrivod}>
                            <option value=''>Привод</option>
                            {filterOptions.drives.map((drive, index) => (
                                <option key={index} value={drive}>{drive}</option>
                            ))}
                        </select>
                        <select className='select2' value={selectedKyzov} onChange={handleChangeKyzov}>
                            <option value=''>Кузов</option>
                            {filterOptions.bodies.map((body, index) => (
                                <option key={index} value={body}>{body}</option>
                            ))}
                        </select>
                        <select className='select2' value={selectedToplivo} onChange={handleChangeToplivo}>
                            <option value=''>Топливо</option>
                            {filterOptions.fuels.map((fuel, index) => (
                                <option key={index} value={fuel}>{fuel}</option>
                            ))}
                        </select>
                    </div>
                    <div className='button_div'>
                        <button className="button1" onClick={handleSubmit}>Найти</button>
                    </div>
                </div>
            </section>
            <section className='section2'  id="about">
                <h2 className='s_h2'>О компании</h2>
                <div className='d_2'>
                    <div className='d_img'>
                        <img className='img2' src="../../public/image 3.jpg" alt="" />
                        <img className='img2' src="../../public/image 4.jpg" alt="" />
                    </div>               
                    <p className="p_1">
                        BaseMotors - динамичный автосалон, предлагающий широкий ассортимент автомобилей и высокий уровень обслуживания.
                        BaseMotors — это современный автосалон, который предлагает своим клиентам широкий выбор автомобилей на любой вкус и кошелек. 
                        Наша цель — предоставить качественный сервис и сделать процесс покупки автомобиля максимально удобным и приятным.
                        В BaseMotors мы ценим каждого клиента и стремимся к тому, чтобы ваше взаимодействие с нами было максимально комфортным. 
                        Приходите в наш автосалон, и мы обязательно поможем вам найти ваш идеальный автомобиль!
                    </p>
                </div>
            </section>
        </>
    );
}

