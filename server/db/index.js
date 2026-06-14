import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Эта настройка часто требуется для Supabase [citation:4]
});
// Проверка подключения
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.stack);
    } else {
        console.log('✅ Successfully connected to database');
        release();
    }
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();