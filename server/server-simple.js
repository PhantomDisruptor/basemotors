import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Временные данные (копия из вашего arr.js)
const cars = [
    {
        "id": 1,
        "img": "/images/601909f6dfa015049615db25.jpg",
        "brand": "Toyota",
        "model": "Camry",
        "price": 2500000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 200,
        "max_speed": 210,
        "number_of_gears": 8,
        "acceleration_0_100": 8.0,
        "trunk_volume": 500,
        "fuel_consumption": 8.5,
        "number_of_cars_in_showroom": 5,
        "year": 2021,
        "color": "чёрный"
    },
    {
        "id": 2,
        "img": "/images/maxresdefault.jpg",
        "brand": "Toyota",
        "model": "RAV4",
        "price": 3000000,
        "transmission": "АКПП",
        "drive": "полный",
        "body": "внедорожник",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 203,
        "max_speed": 200,
        "number_of_gears": 8,
        "acceleration_0_100": 8.5,
        "trunk_volume": 580,
        "fuel_consumption": 7.5,
        "number_of_cars_in_showroom": 4,
        "year": 2022,
        "color": "Голубой"
    },
    {
        "id": 3,
        "img": "/images/22614427_web1_TSR-2020-Honda-Civic-front-EDH-200905.jpg",
        "brand": "Honda",
        "model": "Civic",
        "price": 2200000,
        "transmission": "МКПП",
        "drive": "передний",
        "body": "хэтчбек",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 158,
        "max_speed": 200,
        "number_of_gears": 6,
        "acceleration_0_100": 7.5,
        "trunk_volume": 400,
        "fuel_consumption": 7.0,
        "number_of_cars_in_showroom": 4,
        "year": 2020,
        "color": "Серый"
    },
    {
        "id": 4,
        "img": "/images/9.jpg",
        "brand": "Honda",
        "model": "Accord",
        "price": 2600000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.4,
        "engine_power": 189,
        "max_speed": 210,
        "number_of_gears": 6,
        "acceleration_0_100": 6.8,
        "trunk_volume": 450,
        "fuel_consumption": 7.5,
        "number_of_cars_in_showroom": 3,
        "year": 2021,
        "color": "серебряный"
    },
    {
        "id": 5,
        "img": "/images/Ford_Focus_Mk_IV_Facelift_Auto_Zuerich_2021_IMG_0406.jpg",
        "brand": "Ford",
        "model": "Focus",
        "price": 2100000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 1.5,
        "engine_power": 180,
        "max_speed": 195,
        "number_of_gears": 6,
        "acceleration_0_100": 8.5,
        "trunk_volume": 450,
        "fuel_consumption": 6.5,
        "number_of_cars_in_showroom": 3,
        "year": 2021,
        "color": "голубой"
    },
    {
        "id": 6,
        "img": "/images/bbrg5u12bp1byct9kjdnsencckpnm71t.jpg",
        "brand": "Ford",
        "model": "Escape",
        "price": 2800000,
        "transmission": "АКПП",
        "drive": "полный",
        "body": "внедорожник",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 190,
        "max_speed": 200,
        "number_of_gears": 8,
        "acceleration_0_100": 7.5,
        "trunk_volume": 600,
        "fuel_consumption": 8.0,
        "number_of_cars_in_showroom": 3,
        "year": 2022,
        "color": "зеленый"
    },
    {
        "id": 7,
        "img": "/images/2-BMW-3-Series.jpg",
        "brand": "BMW",
        "model": "3 Series",
        "price": 3500000,
        "transmission": "АКПП",
        "drive": "задний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 250,
        "max_speed": 250,
        "number_of_gears": 8,
        "acceleration_0_100": 5.8,
        "trunk_volume": 480,
        "fuel_consumption": 7.5,
        "number_of_cars_in_showroom": 2,
        "year": 2022,
        "color": "серый"
    },
    {
        "id": 8,
        "img": "/images/audi-a4-faelift-2021.jpg",
        "brand": "Audi",
        "model": "A4",
        "price": 3300000,
        "transmission": "АКПП",
        "drive": "полный",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 245,
        "max_speed": 240,
        "number_of_gears": 7,
        "acceleration_0_100": 6.5,
        "trunk_volume": 480,
        "fuel_consumption": 6.8,
        "number_of_cars_in_showroom": 3,
        "year": 2021,
        "color": "серебряный"
    },
    {
        "id": 9,
        "img": "/images/Mercedes_C300D_0000.jpg",
        "brand": "Mercedes-Benz",
        "model": "C-Class",
        "price": 4000000,
        "transmission": "АКПП",
        "drive": "задний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 255,
        "max_speed": 250,
        "number_of_gears": 9,
        "acceleration_0_100": 5.9,
        "trunk_volume": 480,
        "fuel_consumption": 7.0,
        "number_of_cars_in_showroom": 2,
        "year": 2022,
        "color": "черный"
    },
    {
        "id": 10,
        "img": "/images/2019-nissan-altima-102-1538074559.jpg",
        "brand": "Nissan",
        "model": "Altima",
        "price": 2400000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 182,
        "max_speed": 210,
        "number_of_gears": 1,
        "acceleration_0_100": 8.2,
        "trunk_volume": 450,
        "fuel_consumption": 8.0,
        "number_of_cars_in_showroom": 4,
        "year": 2020,
        "color": "белый"
    },
    {
        "id": 11,
        "img": "/images/1.jpg",
        "brand": "Hyundai",
        "model": "Sonata",
        "price": 2300000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.4,
        "engine_power": 185,
        "max_speed": 200,
        "number_of_gears": 6,
        "acceleration_0_100": 8.0,
        "trunk_volume": 450,
        "fuel_consumption": 7.5,
        "number_of_cars_in_showroom": 5,
        "year": 2021,
        "color": "серый"
    },
    {
        "id": 12,
        "img": "/images/2020-kia-k5-kdm-spec.jpg",
        "brand": "Kia",
        "model": "Optima",
        "price": 2200000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 147,
        "max_speed": 190,
        "number_of_gears": 6,
        "acceleration_0_100": 9.0,
        "trunk_volume": 450,
        "fuel_consumption": 8.0,
        "number_of_cars_in_showroom": 4,
        "year": 2020,
        "color": "черный"
    },
    {
        "id": 13,
        "img": "/images/image-28-04-21-20-15-scaled.jpg",
        "brand": "Volkswagen",
        "model": "Passat",
        "price": 2700000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 2.0,
        "engine_power": 174,
        "max_speed": 210,
        "number_of_gears": 6,
        "acceleration_0_100": 7.8,
        "trunk_volume": 586,
        "fuel_consumption": 7.2,
        "number_of_cars_in_showroom": 3,
        "year": 2021,
        "color": "белый"
    },
    {
        "id": 14,
        "img": "/images/2021-chevrolet-malibu-mmp-1-1598373352.jpg",
        "brand": "Chevrolet",
        "model": "Malibu",
        "price": 2400000,
        "transmission": "АКПП",
        "drive": "передний",
        "body": "седан",
        "fuel": "бензин",
        "engine_volume": 1.5,
        "engine_power": 160,
        "max_speed": 195,
        "number_of_gears": 6,
        "acceleration_0_100": 8.5,
        "trunk_volume": 450,
        "fuel_consumption": 7.8,
        "number_of_cars_in_showroom": 4,
        "year": 2021,
        "color": "черный"
    },
    {
        "id": 15,
        "img": "/images/content3-image-desktop-1200x820.jpg",
        "brand": "Subaru",
        "model": "Outback",
        "price": 3200000,
        "transmission": "CVT",
        "drive": "полный",
        "body": "кроссовер",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 182,
        "max_speed": 210,
        "number_of_gears": 1,
        "acceleration_0_100": 8.5,
        "trunk_volume": 500,
        "fuel_consumption": 8.0,
        "number_of_cars_in_showroom": 3,
        "year": 2022,
        "color": "синий"
    },
    {
        "id": 16,
        "img": "/images/2021-mazda-cx-5_100769178_h.jpg",
        "brand": "Mazda",
        "model": "CX-5",
        "price": 2900000,
        "transmission": "МКПП",
        "drive": "полный",
        "body": "кроссовер",
        "fuel": "бензин",
        "engine_volume": 2.5,
        "engine_power": 187,
        "max_speed": 210,
        "number_of_gears": 6,
        "acceleration_0_100": 7.9,
        "trunk_volume": 506,
        "fuel_consumption": 7.5,
        "number_of_cars_in_showroom": 2,
        "year": 2021,
        "color": "красный"
    }
];

// Маршруты
app.get('/api/filters/brands', (req, res) => {
    const brands = [...new Set(cars.map(c => c.brand))];
    res.json(brands);
});

app.get('/api/filters/models/:brand', (req, res) => {
    const models = [...new Set(cars.filter(c => c.brand === req.params.brand).map(c => c.model))];
    res.json(models);
});

app.get('/api/filters/options', (req, res) => {
    res.json({
        transmissions: [...new Set(cars.map(c => c.transmission))],
        drives: [...new Set(cars.map(c => c.drive))],
        bodies: [...new Set(cars.map(c => c.body))],
        fuels: [...new Set(cars.map(c => c.fuel))]
    });
});

app.post('/api/filters/search', (req, res) => {
    let filtered = [...cars];
    const { brand, model, min_price, max_price, transmission, drive, body, fuel } = req.body;
    
    if (brand && brand !== '') {
        filtered = filtered.filter(c => c.brand === brand);
    }
    if (model && model !== '') {
        filtered = filtered.filter(c => c.model === model);
    }
    if (min_price && min_price > 0) {
        filtered = filtered.filter(c => c.price >= min_price);
    }
    if (max_price && max_price > 0) {
        filtered = filtered.filter(c => c.price <= max_price);
    }
    if (transmission && transmission !== '') {
        filtered = filtered.filter(c => c.transmission === transmission);
    }
    if (drive && drive !== '') {
        filtered = filtered.filter(c => c.drive === drive);
    }
    if (body && body !== '') {
        filtered = filtered.filter(c => c.body === body);
    }
    if (fuel && fuel !== '') {
        filtered = filtered.filter(c => c.fuel === fuel);
    }
    
    res.json(filtered);
});

app.get('/api/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (!car) {
        return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
});

app.post('/api/orders', (req, res) => {
    const { car_id, last_name, first_name, middle_name, phone, email } = req.body;
    
    // Проверка обязательных полей
    if (!car_id || !last_name || !first_name || !phone || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const car = cars.find(c => c.id === car_id);
    if (!car) {
        return res.status(404).json({ error: 'Car not found' });
    }
    
    if (car.number_of_cars_in_showroom <= 0) {
        return res.status(400).json({ error: 'No cars in stock' });
    }
    
    // Уменьшаем количество
    car.number_of_cars_in_showroom--;
    
    console.log('Order received:', {
        car: `${car.brand} ${car.model}`,
        customer: `${last_name} ${first_name}`,
        phone,
        email
    });
    
    res.status(201).json({ 
        message: 'Order created successfully',
        order: {
            id: Date.now(),
            car_id,
            car_brand: car.brand,
            car_model: car.model,
            last_name,
            first_name,
            middle_name,
            phone,
            email
        }
    });
});

// Тестовый маршрут
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!', carsCount: cars.length });
});

app.listen(PORT, () => {
    console.log(`✅ Simple server running on http://localhost:${PORT}`);
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`🚗 Cars count: ${cars.length}`);
});