import express from 'express';
import authRoutes from './auth-routes.js';
import { authenticateToken } from '../middleware/auth.js';
import * as ticketController from '../controllers/ticket-controller.js';
import * as userController from '../controllers/user-controller.js';
const router = express.Router();
// Public routes
router.use('/auth', authRoutes);
// Protected routes
router.use(authenticateToken); // Apply authentication to all routes below
// User routes
router.get('/users', userController.getUsers);
// Ticket routes - full CRUD operations
router.post('/tickets', ticketController.createTicket);
router.get('/tickets', ticketController.getTickets);
router.get('/tickets/:id', ticketController.getTicket);
router.put('/tickets/:id', ticketController.updateTicket);
router.put('/tickets/:id/status', ticketController.updateTicketStatus);
router.delete('/tickets/:id', ticketController.deleteTicket);
export { router };
