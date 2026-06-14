import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';

export const authenticateToken = async (req, res, next) => {
    // ПРОВЕРЯЕМ ВСЕ ВОЗМОЖНЫЕ МЕСТА, ОТКУДА МОЖЕТ ПРИЙТИ ТОКЕН
    let token = req.headers['authorization']?.split(' ')[1];
    
    // Если нет в заголовке, пробуем взять из cookie
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
        console.log('Token from cookie');
    }
    
    console.log('Token from header/body:', {
        hasAuthHeader: !!req.headers['authorization'],
        authHeaderValue: req.headers['authorization']?.substring(0, 50),
        hasCookie: !!req.cookies?.token,
        tokenValue: token?.substring(0, 50) + '...'
    });
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Проверяем, существует ли сессия
        const session = await query(
            'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
            [token]
        );
        
        if (session.rows.length === 0) {
            return res.status(401).json({ error: 'Session expired' });
        }
        
        // Получаем пользователя
        const user = await query(
            'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = $1',
            [decoded.userId]
        );
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        req.user = user.rows[0];
        next();
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};