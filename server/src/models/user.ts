import pool from './index.js';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
}

type DatabaseUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
};

export const createUser = async (username: string, email: string, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query<DatabaseUser>(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query<DatabaseUser>(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] ? result.rows[0] : null;
};

export const findByUsernameOrEmail = async (username: string, email: string): Promise<User[]> => {
  const result = await pool.query<DatabaseUser>(
    'SELECT * FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  return result.rows;
};

export const findById = async (id: number): Promise<User | null> => {
  const result = await pool.query<DatabaseUser>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] ? result.rows[0] : null;
};