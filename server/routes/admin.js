import express from 'express';
import { query, getClient } from '../db/index.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../client/public/images');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Применяем middleware для всех маршрутов
router.use(authenticateToken);
router.use(requireAdmin);

// Управление автомобилями
router.get('/cars', async (req, res) => {
    try {
        const result = await query('SELECT * FROM cars ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching cars:', err);
        res.status(500).json({ error: err.message });
    }
});

// Добавить автомобиль
router.post('/cars', upload.single('image'), async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        let carData;
        try {
            carData = JSON.parse(req.body.carData);
        } catch (e) {
            carData = req.body;
        }
        
        const imgPath = req.file ? `/images/${req.file.filename}` : (carData.img || '/images/default.jpg');
        
        const result = await client.query(
            `INSERT INTO cars (
                img, brand, model, price, transmission, drive, body, fuel,
                engine_volume, engine_power, max_speed, number_of_gears,
                acceleration_0_100, trunk_volume, fuel_consumption,
                number_of_cars_in_showroom, year, color
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
            [
                imgPath, carData.brand, carData.model, parseInt(carData.price),
                carData.transmission, carData.drive, carData.body, carData.fuel,
                parseFloat(carData.engine_volume), parseInt(carData.engine_power), parseInt(carData.max_speed),
                parseInt(carData.number_of_gears), parseFloat(carData.acceleration_0_100),
                parseInt(carData.trunk_volume), parseFloat(carData.fuel_consumption),
                parseInt(carData.number_of_cars_in_showroom), parseInt(carData.year), carData.color
            ]
        );
        
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error adding car:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Обновить автомобиль
router.put('/cars/:id', upload.single('image'), async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const carId = req.params.id;
        let carData;
        try {
            carData = JSON.parse(req.body.carData);
        } catch (e) {
            carData = req.body;
        }
        
        let imgPath = carData.img;
        if (req.file) {
            imgPath = `/images/${req.file.filename}`;
        }
        
        const result = await client.query(
            `UPDATE cars SET 
                img = $1, brand = $2, model = $3, price = $4,
                transmission = $5, drive = $6, body = $7, fuel = $8,
                engine_volume = $9, engine_power = $10, max_speed = $11,
                number_of_gears = $12, acceleration_0_100 = $13,
                trunk_volume = $14, fuel_consumption = $15,
                number_of_cars_in_showroom = $16, year = $17, color = $18,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $19 RETURNING *`,
            [
                imgPath, carData.brand, carData.model, parseInt(carData.price),
                carData.transmission, carData.drive, carData.body, carData.fuel,
                parseFloat(carData.engine_volume), parseInt(carData.engine_power), parseInt(carData.max_speed),
                parseInt(carData.number_of_gears), parseFloat(carData.acceleration_0_100),
                parseInt(carData.trunk_volume), parseFloat(carData.fuel_consumption),
                parseInt(carData.number_of_cars_in_showroom), parseInt(carData.year), carData.color,
                carId
            ]
        );
        
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Car not found' });
        }
        
        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating car:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Удалить автомобиль
router.delete('/cars/:id', async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        // Проверяем, есть ли заявки
        const orders = await client.query(
            'SELECT id FROM orders WHERE car_id = $1',
            [req.params.id]
        );
        
        if (orders.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Cannot delete car with existing orders' });
        }
        
        await client.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
        
        await client.query('COMMIT');
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting car:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Заявки
router.get('/orders', async (req, res) => {
    try {
        const result = await query(
            `SELECT o.*, u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
             FROM orders o 
             LEFT JOIN users u ON o.user_id = u.id 
             ORDER BY o.order_date DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: err.message });
    }
});

// Обновить статус заявки
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: err.message });
    }
});

// Пользователи
router.get('/users', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, email, first_name, last_name, phone, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: err.message });
    }
});

// Статистика
router.get('/stats', async (req, res) => {
    try {
        const totalCars = await query('SELECT COUNT(*) FROM cars');
        const totalOrders = await query('SELECT COUNT(*) FROM orders');
        const totalUsers = await query('SELECT COUNT(*) FROM users');
        const pendingOrders = await query('SELECT COUNT(*) FROM orders WHERE status = \'pending\'');
        
        res.json({
            totalCars: parseInt(totalCars.rows[0].count),
            totalOrders: parseInt(totalOrders.rows[0].count),
            totalUsers: parseInt(totalUsers.rows[0].count),
            pendingOrders: parseInt(pendingOrders.rows[0].count)
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;