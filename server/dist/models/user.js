import pool from './index';
import bcrypt from 'bcrypt';
export const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
    return result.rows[0];
};
export const findByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] ? result.rows[0] : null;
};
export const findByUsernameOrEmail = async (username, email) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    return result.rows;
};
export const findById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? result.rows[0] : null;
};
