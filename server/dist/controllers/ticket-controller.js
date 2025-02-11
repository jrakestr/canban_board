import * as ticketModel from '../models/ticket';
export const createTicket = async (req, res) => {
    try {
        const { title, description, status = 'Todo' } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
        const ticket = await ticketModel.createTicket(title, description, userId, status);
        res.status(201).json(ticket);
    }
    catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};
export const getTickets = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const tickets = await ticketModel.getTicketsByUserId(userId);
        res.json(tickets);
    }
    catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};
export const getTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const ticket = await ticketModel.getTicketById(parseInt(id));
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (ticket.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to access this ticket' });
        }
        res.json(ticket);
    }
    catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: 'Failed to get ticket' });
    }
};
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }
        const existingTicket = await ticketModel.getTicketById(parseInt(id));
        if (!existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (existingTicket.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this ticket' });
        }
        const updatedTicket = await ticketModel.updateTicket(parseInt(id), { title, description, status });
        res.json(updatedTicket);
    }
    catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};
export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const existingTicket = await ticketModel.getTicketById(parseInt(id));
        if (!existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (existingTicket.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this ticket' });
        }
        const updatedTicket = await ticketModel.updateTicketStatus(parseInt(id), status);
        res.json(updatedTicket);
    }
    catch (error) {
        console.error('Update ticket status error:', error);
        res.status(500).json({ error: 'Failed to update ticket status' });
    }
};
export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const existingTicket = await ticketModel.getTicketById(parseInt(id));
        if (!existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        if (existingTicket.user_id !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this ticket' });
        }
        await ticketModel.deleteTicket(parseInt(id));
        res.status(204).send();
    }
    catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
};
