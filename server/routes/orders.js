import express from 'express';
import { query, getClient } from '../db/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Функция для получения user_id из токена
const getUserIdFromToken = (authHeader) => {
    if (!authHeader) return null;
    
    const token = authHeader.split(' ')[1];
    if (!token) return null;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token userId:', decoded.userId);
        return decoded.userId;
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return null;
    }
};
с

// Создать заявку
router.post('/', async (req, res) => {
    console.log('=== CREATE ORDER ===');
    console.log('Request headers:', req.headers);
    console.log('Request cookies:', req.cookies);
    console.log('Request body:', req.body);
    
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        // Получаем user_id из cookie
        let userId = null;
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
                console.log('User ID from cookie:', userId);
            } catch (err) {
                console.log('Token error:', err.message);
            }
        }
        
        const { car_id, last_name, first_name, middle_name, phone, email } = req.body;
        
        // Проверка обязательных полей
        if (!car_id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'car_id is required' });
        }
        if (!last_name) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'last_name is required' });
        }
        if (!first_name) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'first_name is required' });
        }
        if (!phone) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'phone is required' });
        }
        if (!email) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'email is required' });
        }
        
        console.log('All required fields present');
        
        // Проверяем автомобиль
        const carResult = await client.query(
            'SELECT brand, model, number_of_cars_in_showroom FROM cars WHERE id = $1',
            [car_id]
        );
        
        console.log('Car query result:', carResult.rows);
        
        if (carResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Car not found' });
        }
        
        const car = carResult.rows[0];
        
        if (car.number_of_cars_in_showroom <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No cars in stock' });
        }
        
        // Создаем заявку
        const insertQuery = `
            INSERT INTO orders (user_id, car_id, car_brand, car_model, last_name, first_name, middle_name, phone, email, status, order_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW()) 
            RETURNING *
        `;
        
        const insertValues = [
            userId, 
            car_id, 
            car.brand, 
            car.model, 
            last_name, 
            first_name, 
            middle_name || null, 
            phone, 
            email
        ];
        
        console.log('Insert query:', insertQuery);
        console.log('Insert values:', insertValues);
        
        const orderResult = await client.query(insertQuery, insertValues);
        
        console.log('Order created:', orderResult.rows[0]);
        
        // Уменьшаем количество
        await client.query(
            'UPDATE cars SET number_of_cars_in_showroom = number_of_cars_in_showroom - 1 WHERE id = $1',
            [car_id]
        );
        
        await client.query('COMMIT');
        
        res.status(201).json({ 
            success: true,
            message: 'Заявка создана',
            order: orderResult.rows[0]
        });
        
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('ERROR DETAILS:');
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            error: err.message,
            details: err.stack
        });
    } finally {
        client.release();
    }
});

// Получить заявки текущего пользователя (из cookie)
router.get('/my-orders', async (req, res) => {
    console.log('=== GET MY ORDERS ===');
    console.log('Cookies:', req.cookies);
    
    // Получаем токен из cookie
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        console.log('No token in cookies');
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        console.log('User ID from cookie:', userId);
        
        const result = await query(
            `SELECT * FROM orders 
             WHERE user_id = $1 
             ORDER BY order_date DESC`,
            [userId]
        );
        
        console.log('Orders found:', result.rows.length);
        res.json(result.rows);
        
    } catch (err) {
        console.error('Error:', err.message);
        res.status(403).json({ error: 'Invalid token' });
    }
});

export default router;