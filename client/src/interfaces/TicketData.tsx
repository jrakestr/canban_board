export interface TicketData {
  id: number;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export type NewTicketData = Omit<TicketData, 'id' | 'created_at' | 'updated_at'>;