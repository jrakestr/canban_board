import * as ticketModel from '../models/ticket.js';
import pool from '../models/index.js';
export const seedTickets = async () => {
    try {
        console.log('Seeding tickets...');
        // Check if tickets already exist
        const existingTickets = await pool.query('SELECT COUNT(*) FROM tickets');
        console.log(`Found ${existingTickets.rows[0].count} existing tickets`);
        if (parseInt(existingTickets.rows[0].count) > 0) {
            console.log('Tickets already seeded, skipping...');
            return;
        }
        const tickets = [
            {
                title: 'Design landing page',
                description: 'Create wireframes and mockups for the landing page.',
                userId: 1,
                status: 'Todo'
            },
            {
                title: 'Set up project repository',
                description: 'Create a new repository on GitHub and initialize it with a README file.',
                userId: 2,
                status: 'In Progress'
            },
            {
                title: 'Implement authentication',
                description: 'Set up user authentication using JWT tokens.',
                userId: 1,
                status: 'Done'
            },
            {
                title: 'Test the API',
                description: 'Write and execute API tests.',
                userId: 3,
                status: 'Todo'
            },
            {
                title: 'Deploy to production',
                description: 'Deploy the application to production environment.',
                userId: 1,
                status: 'In Progress'
            }
        ];
        for (const ticket of tickets) {
            try {
                const created = await ticketModel.createTicket(ticket.title, ticket.description, ticket.userId, ticket.status);
                console.log(`Created ticket: ${created.title}`);
            }
            catch (err) {
                console.error(`Failed to create ticket "${ticket.title}":`, err);
            }
        }
        console.log('Tickets seeding completed!');
    }
    catch (err) {
        console.error('Error during ticket seeding:', err);
        throw err;
    }
};
