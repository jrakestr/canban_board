import pool from './index.js';
export const createTicket = async (title, description, user_id, status = 'Todo') => {
    const result = await pool.query('INSERT INTO tickets (title, description, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *', [title, description, user_id, status]);
    return result.rows[0];
};
export const getTicketsByUserId = async (userId) => {
    const result = await pool.query('SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
};
export const getTicketById = async (ticketId) => {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    return result.rows[0] || null;
};
export const updateTicketStatus = async (ticketId, status) => {
    const result = await pool.query('UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *', [status, ticketId]);
    return result.rows[0] || null;
};
export const updateTicket = async (ticketId, updates) => {
    const setClause = Object.entries(updates)
        .map(([key, _], index) => `${key} = $${index + 2}`)
        .join(', ');
    const values = [ticketId, ...Object.values(updates)];
    const result = await pool.query(`UPDATE tickets SET ${setClause} WHERE id = $1 RETURNING *`, values);
    return result.rows[0] || null;
};
export const deleteTicket = async (ticketId) => {
    await pool.query('DELETE FROM tickets WHERE id = $1', [ticketId]);
};
