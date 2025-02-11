import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { NewTicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { getUsers } from '../api/userAPI';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<NewTicketData>({
    title: '',
    description: '',
    status: 'Todo',
    user_id: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);

  const getAllUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to retrieve user info', err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await createTicket(newTicket);
      // Navigate to board with state to trigger refresh
      navigate('/board', { 
        state: { 
          newTicket: data,
          message: 'Ticket created successfully'
        }
      });
    } catch (err) {
      setIsSubmitting(false);
      console.error('Failed to create ticket:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
      // Show error in form instead of alert
      setError(errorMessage);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Ticket</h1>

              <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">Ticket Title</label>
              <textarea
                id="title"
                name="title"
                value={newTicket.title}
                onChange={handleTextChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={2}
                required
                disabled={isSubmitting}
              />

              <label htmlFor="status" className="text-sm font-medium text-gray-700 mt-4 mb-1">Status</label>
              <select
                name="status"
                id="status"
                value={newTicket.status}
                onChange={handleTextChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <label htmlFor="description" className="text-sm font-medium text-gray-700 mt-4 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={newTicket.description}
                onChange={handleTextChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={4}
                required
                disabled={isSubmitting}
              />

              <label htmlFor="user_id" className="text-sm font-medium text-gray-700 mt-4 mb-1">Assigned To</label>
              <select
                name="user_id"
                id="user_id"
                value={newTicket.user_id}
                onChange={handleTextChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                disabled={isSubmitting}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => navigate('/board')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
