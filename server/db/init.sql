-- Создание таблицы автомобилей
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    img TEXT NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    drive VARCHAR(50) NOT NULL,
    body VARCHAR(50) NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    engine_volume DECIMAL(3,1) NOT NULL,
    engine_power INTEGER NOT NULL,
    max_speed INTEGER NOT NULL,
    number_of_gears INTEGER NOT NULL,
    acceleration_0_100 DECIMAL(3,1) NOT NULL,
    trunk_volume INTEGER NOT NULL,
    fuel_consumption DECIMAL(3,1) NOT NULL,
    number_of_cars_in_showroom INTEGER NOT NULL DEFAULT 0,
    year INTEGER NOT NULL,
    color VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
    car_brand VARCHAR(100),
    car_model VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Вставка данных из arr.js
INSERT INTO cars (id, img, brand, model, price, transmission, drive, body, fuel, engine_volume, engine_power, max_speed, number_of_gears, acceleration_0_100, trunk_volume, fuel_consumption, number_of_cars_in_showroom, year, color) VALUES
(1, '/images/601909f6dfa015049615db25.jpg', 'Toyota', 'Camry', 2500000, 'АКПП', 'передний', 'седан', 'бензин', 2.5, 200, 210, 8, 8.0, 500, 8.5, 5, 2021, 'чёрный'),
(2, '/images/maxresdefault.jpg', 'Toyota', 'RAV4', 3000000, 'АКПП', 'полный', 'внедорожник', 'бензин', 2.5, 203, 200, 8, 8.5, 580, 7.5, 4, 2022, 'Голубой'),
(3, '/images/22614427_web1_TSR-2020-Honda-Civic-front-EDH-200905.jpg', 'Honda', 'Civic', 2200000, 'МКПП', 'передний', 'хэтчбек', 'бензин', 2.0, 158, 200, 6, 7.5, 400, 7.0, 4, 2020, 'Серый'),
(4, '/images/9.jpg', 'Honda', 'Accord', 2600000, 'АКПП', 'передний', 'седан', 'бензин', 2.4, 189, 210, 6, 6.8, 450, 7.5, 3, 2021, 'серебряный'),
(5, '/images/Ford_Focus_Mk_IV_Facelift_Auto_Zuerich_2021_IMG_0406.jpg', 'Ford', 'Focus', 2100000, 'АКПП', 'передний', 'седан', 'бензин', 1.5, 180, 195, 6, 8.5, 450, 6.5, 3, 2021, 'голубой'),
(6, '/images/bbrg5u12bp1byct9kjdnsencckpnm71t.jpg', 'Ford', 'Escape', 2800000, 'АКПП', 'полный', 'внедорожник', 'бензин', 2.5, 190, 200, 8, 7.5, 600, 8.0, 3, 2022, 'зеленый'),
(7, '/images/2-BMW-3-Series.jpg', 'BMW', '3 Series', 3500000, 'АКПП', 'задний', 'седан', 'бензин', 2.0, 250, 250, 8, 5.8, 480, 7.5, 2, 2022, 'серый'),
(8, '/images/audi-a4-faelift-2021.jpg', 'Audi', 'A4', 3300000, 'АКПП', 'полный', 'седан', 'бензин', 2.0, 245, 240, 7, 6.5, 480, 6.8, 3, 2021, 'серебряный'),
(9, '/images/Mercedes_C300D_0000.jpg', 'Mercedes-Benz', 'C-Class', 4000000, 'АКПП', 'задний', 'седан', 'бензин', 2.0, 255, 250, 9, 5.9, 480, 7.0, 2, 2022, 'черный'),
(10, '/images/2019-nissan-altima-102-1538074559.jpg', 'Nissan', 'Altima', 2400000, 'АКПП', 'передний', 'седан', 'бензин', 2.5, 182, 210, 1, 8.2, 450, 8.0, 4, 2020, 'белый'),
(11, '/images/1.jpg', 'Hyundai', 'Sonata', 2300000, 'АКПП', 'передний', 'седан', 'бензин', 2.4, 185, 200, 6, 8.0, 450, 7.5, 5, 2021, 'серый'),
(12, '/images/2020-kia-k5-kdm-spec.jpg', 'Kia', 'Optima', 2200000, 'АКПП', 'передний', 'седан', 'бензин', 2.0, 147, 190, 6, 9.0, 450, 8.0, 4, 2020, 'черный'),
(13, '/images/image-28-04-21-20-15-scaled.jpg', 'Volkswagen', 'Passat', 2700000, 'АКПП', 'передний', 'седан', 'бензин', 2.0, 174, 210, 6, 7.8, 586, 7.2, 3, 2021, 'белый'),
(14, '/images/2021-chevrolet-malibu-mmp-1-1598373352.jpg', 'Chevrolet', 'Malibu', 2400000, 'АКПП', 'передний', 'седан', 'бензин', 1.5, 160, 195, 6, 8.5, 450, 7.8, 4, 2021, 'черный'),
(15, '/images/content3-image-desktop-1200x820.jpg', 'Subaru', 'Outback', 3200000, 'CVT', 'полный', 'кроссовер', 'бензин', 2.5, 182, 210, 1, 8.5, 500, 8.0, 3, 2022, 'синий'),
(16, '/images/2021-mazda-cx-5_100769178_h.jpg', 'Mazda', 'CX-5', 2900000, 'МКПП', 'полный', 'кроссовер', 'бензин', 2.5, 187, 210, 6, 7.9, 506, 7.5, 2, 2021, 'красный');

-- Сброс последовательности id
SELECT setval('cars_id_seq', (SELECT MAX(id) FROM cars));