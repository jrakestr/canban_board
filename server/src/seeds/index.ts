import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';
import pool from '../models/index.js';

const seedAll = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Run seeds in order
    await seedUsers();
    await seedTickets();
    
    console.log('All seeds completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the database connection
    await pool.end();
    process.exit(0);
  }
};

// Run the seeds
seedAll();