import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Create a new pool using the connection string
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'kanban_board',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});
// Add event listener for errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
// Debug database queries in development
if (process.env.NODE_ENV === 'development') {
    const originalQuery = pool.query.bind(pool);
    pool.query = function (text, ...params) {
        if (typeof text === 'string') {
            console.log('EXECUTING QUERY:', text);
        }
        return originalQuery(text, ...params);
    };
}
export default pool;
