import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// Получить все уникальные марки
router.get('/brands', async (req, res) => {
    try {
        const result = await query(
            'SELECT DISTINCT brand FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY brand'
        );
        res.json(result.rows.map(row => row.brand));
    } catch (err) {
        console.error('Error in GET /filters/brands:', err);
        res.status(500).json({ error: err.message });
    }
});

// Получить модели по марке
router.get('/models/:brand', async (req, res) => {
    try {
        const { brand } = req.params;
        const result = await query(
            'SELECT DISTINCT model FROM cars WHERE brand = $1 AND number_of_cars_in_showroom > 0 ORDER BY model',
            [brand]
        );
        res.json(result.rows.map(row => row.model));
    } catch (err) {
        console.error('Error in GET /filters/models/:brand:', err);
        res.status(500).json({ error: err.message });
    }
});

// Получить все опции для фильтров
router.get('/options', async (req, res) => {
    try {
        const transmissions = await query(
            'SELECT DISTINCT transmission FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY transmission'
        );
        const drives = await query(
            'SELECT DISTINCT drive FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY drive'
        );
        const bodies = await query(
            'SELECT DISTINCT body FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY body'
        );
        const fuels = await query(
            'SELECT DISTINCT fuel FROM cars WHERE number_of_cars_in_showroom > 0 ORDER BY fuel'
        );
        
        res.json({
            transmissions: transmissions.rows.map(row => row.transmission),
            drives: drives.rows.map(row => row.drive),
            bodies: bodies.rows.map(row => row.body),
            fuels: fuels.rows.map(row => row.fuel)
        });
    } catch (err) {
        console.error('Error in GET /filters/options:', err);
        res.status(500).json({ error: err.message });
    }
});

// Поиск автомобилей
router.post('/search', async (req, res) => {
    try {
        const { brand, model, min_price, max_price, transmission, drive, body, fuel } = req.body;
        
        let queryText = 'SELECT * FROM cars WHERE number_of_cars_in_showroom > 0';
        const params = [];
        let paramIndex = 1;
        
        if (brand && brand !== '') {
            queryText += ` AND brand = $${paramIndex}`;
            params.push(brand);
            paramIndex++;
        }
        
        if (model && model !== '') {
            queryText += ` AND model = $${paramIndex}`;
            params.push(model);
            paramIndex++;
        }
        
        if (min_price && min_price > 0) {
            queryText += ` AND price >= $${paramIndex}`;
            params.push(parseInt(min_price));
            paramIndex++;
        }
        
        if (max_price && max_price > 0) {
            queryText += ` AND price <= $${paramIndex}`;
            params.push(parseInt(max_price));
            paramIndex++;
        }
        
        if (transmission && transmission !== '') {
            queryText += ` AND transmission = $${paramIndex}`;
            params.push(transmission);
            paramIndex++;
        }
        
        if (drive && drive !== '') {
            queryText += ` AND drive = $${paramIndex}`;
            params.push(drive);
            paramIndex++;
        }
        
        if (body && body !== '') {
            queryText += ` AND body = $${paramIndex}`;
            params.push(body);
            paramIndex++;
        }
        
        if (fuel && fuel !== '') {
            queryText += ` AND fuel = $${paramIndex}`;
            params.push(fuel);
            paramIndex++;
        }
        
        queryText += ' ORDER BY price';
        
        console.log('Search query:', queryText);
        console.log('Search params:', params);
        
        const result = await query(queryText, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in POST /filters/search:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;