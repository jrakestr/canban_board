import pool from './index.js';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  user_id: number;
  created_at?: Date;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: string;
}

export const createTicket = async (
  title: string,
  description: string,
  user_id: number,
  status: string = 'Todo'
): Promise<Ticket> => {
  const result = await pool.query<Ticket>(
    'INSERT INTO tickets (title, description, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, user_id, status]
  );
  return result.rows[0];
};

export const getTicketsByUserId = async (userId: number): Promise<Ticket[]> => {
  const result = await pool.query<Ticket>(
    'SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getTicketById = async (ticketId: number): Promise<Ticket | null> => {
  const result = await pool.query<Ticket>(
    'SELECT * FROM tickets WHERE id = $1',
    [ticketId]
  );
  return result.rows[0] || null;
};

export const updateTicketStatus = async (ticketId: number, status: string): Promise<Ticket | null> => {
  const result = await pool.query<Ticket>(
    'UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *',
    [status, ticketId]
  );
  return result.rows[0] || null;
};

export const updateTicket = async (
  ticketId: number,
  updates: UpdateTicketData
): Promise<Ticket | null> => {
  const setClause = Object.entries(updates)
    .map(([key, _], index) => `${key} = $${index + 2}`)
    .join(', ');

  const values = [ticketId, ...Object.values(updates)];
  
  const result = await pool.query<Ticket>(
    `UPDATE tickets SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

export const getAllTickets = async (): Promise<Ticket[]> => {
  const result = await pool.query<Ticket>(
    'SELECT * FROM tickets ORDER BY created_at DESC'
  );
  return result.rows;
};

export const deleteTicket = async (ticketId: number): Promise<void> => {
  await pool.query(
    'DELETE FROM tickets WHERE id = $1',
    [ticketId]
  );
};