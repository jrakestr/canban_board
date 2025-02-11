import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3000;
// Enable CORS with specific configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
// Parse JSON bodies
app.use(express.json());
// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// API routes
app.use('/api', router);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`
    🚀 Server is running!
    🔉 Listening on port ${PORT}
    📭 REST API: http://localhost:${PORT}/api
    🚨 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});
