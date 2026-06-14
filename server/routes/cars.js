import express from 'express';
import { query, getClient } from '../db/index.js';

const router = express.Router();

// Получить все автомобили
router.get('/', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY id'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /cars:', err);
        res.status(500).json({ error: err.message });
    }
});

// Получить автомобиль по id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM cars WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in GET /cars/:id:', err);
        res.status(500).json({ error: err.message });
    }
});

// Обновить количество автомобилей
router.put('/:id/update-stock', async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { id } = req.params;
        
        const currentResult = await client.query(
            'SELECT number_of_cars_in_showroom FROM cars WHERE id = $1',
            [id]
        );
        
        if (currentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Car not found' });
        }
        
        const currentCount = currentResult.rows[0].number_of_cars_in_showroom;
        
        if (currentCount <= 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'No cars in stock' });
        }
        
        const result = await client.query(
            'UPDATE cars SET number_of_cars_in_showroom = number_of_cars_in_showroom - 1 WHERE id = $1 RETURNING *',
            [id]
        );
        
        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error in PUT /cars/:id/update-stock:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

export default router;