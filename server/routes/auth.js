import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, getClient } from '../db/index.js';

const router = express.Router();

// Middleware для проверки токена (локальный, чтобы избежать циклического импорта)
const authenticateTokenLocal = async (req, res, next) => {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    console.log('1. Token received:', !!token);
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('2. Token verified, userId:', decoded.userId);
        const session = await query(
            'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
            [token]
        );
        console.log('3. Session found:', session.rows.length);
        if (session.rows.length === 0) {
            return res.status(401).json({ error: 'Session expired' });
        }
        
        const user = await query(
            'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = $1',
            [decoded.userId]
        );
         console.log('4. User found:', !!user.rows.length);
        req.user = user.rows[0];
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Регистрация
router.post('/register', async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { email, password, firstName, lastName, phone } = req.body;
        
        // Проверка обязательных полей
        if (!email || !password || !firstName || !lastName) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Проверка существующего пользователя
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Хеширование пароля
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Создание пользователя
        const result = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
             VALUES ($1, $2, $3, $4, $5, 'user') RETURNING id, email, first_name, last_name, phone, role`,
            [email, passwordHash, firstName, lastName, phone || null]
        );
        
        const user = result.rows[0];
        
        // Создание JWT токена
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Сохранение сессии
        await client.query(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
            [user.id, token]
        );
        
        await client.query('COMMIT');
        
        // Установка cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(201).json({ user, token });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Registration error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Вход
router.post('/login', async (req, res) => {
    const client = await getClient();
    
    try {
        await client.query('BEGIN');
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        // Поиск пользователя
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // Проверка пароля
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Создание токена
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Удаление старых сессий
        await client.query('DELETE FROM sessions WHERE user_id = $1', [user.id]);
        
        // Сохранение новой сессии
        await client.query(
            'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
            [user.id, token]
        );
        
        await client.query('COMMIT');
        
        // Установка cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const { password_hash, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Выход
router.post('/logout', async (req, res) => {
    const token = req.cookies?.token;
    
    if (token) {
        await query('DELETE FROM sessions WHERE token = $1', [token]);
    }
    
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Получение текущего пользователя
router.get('/me', authenticateTokenLocal, async (req, res) => {
    res.json({ user: req.user });
});

// Обновление профиля
router.put('/profile', authenticateTokenLocal, async (req, res) => {
    const { firstName, lastName, phone } = req.body;
    
    try {
        const result = await query(
            `UPDATE users 
             SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $4 
             RETURNING id, email, first_name, last_name, phone, role`,
            [firstName, lastName, phone, req.user.id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;