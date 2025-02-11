import * as ticketModel from '../models/ticket.js';
import * as userModel from '../models/user.js';
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

    // Get user IDs first
    const admin = await userModel.findByUsername('admin');
    const jollyGuru = await userModel.findByUsername('JollyGuru');
    const sunnyScribe = await userModel.findByUsername('SunnyScribe');

    if (!admin || !jollyGuru || !sunnyScribe) {
      throw new Error('Required users not found. Please ensure users are seeded first.');
    }

    const tickets = [
      {
        title: 'Design landing page',
        description: 'Create wireframes and mockups for the landing page.',
        user_id: admin.id,
        status: 'Todo'
      },
      {
        title: 'Set up project repository',
        description: 'Create a new repository on GitHub and initialize it with a README file.',
        user_id: jollyGuru.id,
        status: 'In Progress'
      },
      {
        title: 'Implement authentication',
        description: 'Set up user authentication using JWT tokens.',
        user_id: admin.id,
        status: 'Done'
      },
      {
        title: 'Test the API',
        description: 'Write and execute API tests.',
        user_id: sunnyScribe.id,
        status: 'Todo'
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the application to production environment.',
        user_id: admin.id,
        status: 'In Progress'
      }
    ];

    for (const ticket of tickets) {
      try {
        const created = await ticketModel.createTicket(
          ticket.title,
          ticket.description,
          ticket.user_id,
          ticket.status
        );
        console.log(`Created ticket: ${created.title}`);
      } catch (err) {
        console.error(`Failed to create ticket "${ticket.title}":`, err);
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack
          });
        }
      }
    }

    console.log('Tickets seeding completed!');
  } catch (err) {
    console.error('Error during ticket seeding:', err);
    throw err;
  }
};
