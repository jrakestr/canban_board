import * as userModel from '../models/user.js';
import pool from '../models/index.js';

export const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Check if users already exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('Users already seeded, skipping...');
      return;
    }

    // Create admin user
    await userModel.createUser('admin', 'admin@example.com', 'password123');
    
    // Create demo users
    await userModel.createUser('JollyGuru', 'jolly@example.com', 'password');
    await userModel.createUser('SunnyScribe', 'sunny@example.com', 'password');
    await userModel.createUser('RadiantComet', 'radiant@example.com', 'password');
    
    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};
