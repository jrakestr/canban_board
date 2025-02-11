import * as userModel from '../models/user';
import pool from '../models/index.js';
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await userModel.createUser(username, email, password);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
export const getUsers = async (req, res) => {
    try {
        console.log('EXECUTING QUERY: SELECT id, username FROM users');
        const result = await pool.query('SELECT id, username FROM users');
        if (!result.rows) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({
            error: 'Failed to get users',
            details: err?.message || 'Unknown error occurred'
        });
    }
};
