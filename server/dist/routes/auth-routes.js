import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userModel from '../models/user';
const router = express.Router();
// Validate environment variables
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '24h'; // or whatever duration you want to set
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', { username: req.body.username });
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            console.log('Login failed: Missing credentials');
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find user
        const user = await userModel.findByUsername(username);
        if (!user) {
            console.log('Login failed: User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Login failed: Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Create JWT payload
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        console.log('Login successful:', username);
        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'An error occurred during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required'
            });
        }
        // Check if user exists
        const existingUsers = await userModel.findByUsernameOrEmail(username, email);
        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'Username or email already exists'
            });
        }
        // Create user
        const user = await userModel.createUser(username, email, password);
        // Create JWT payload
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get current user endpoint
router.get('/me', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
