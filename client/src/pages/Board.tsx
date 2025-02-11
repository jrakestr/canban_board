import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation, useNavigate } from 'react-router-dom';
import Swimlane from '../components/Swimlane';
import { getTickets, updateTicketStatus } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import logo from '../assets/canban250.png';

type SortOption = 'title' | 'date' | 'none';

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const location = useLocation();
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle navigation state (e.g., from ticket creation/edit)
  useEffect(() => {
    if (location.state?.message) {
      setFeedback(location.state.message);
      // Clear the message after 3 seconds
      const timer = setTimeout(() => setFeedback(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleTicketMove = async (ticketId: number, newStatus: 'Todo' | 'In Progress' | 'Done') => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) {
        console.error('Ticket not found:', ticketId);
        return;
      }

      const updatedTicket = { ...ticket, status: newStatus };
      await updateTicketStatus(updatedTicket);
      
      // Update local state
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: newStatus } : t
      ));
      
      setError('');
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError('Failed to update ticket status. Please try again.');
      // Refresh tickets to ensure UI is in sync
      fetchTickets();
    }
  };

  const sortTickets = (tickets: TicketData[]) => {
    if (sortBy === 'none') return tickets;

    return [...tickets].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else { // sort by date
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime(); // newest first
      }
    });
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option === sortBy ? 'none' : option);
  };

  const sortedTickets = sortTickets(tickets);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Canban Logo" className="h-12" />
                      </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Create Ticket
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('title')}
                className={`px-4 py-2 rounded-md ${
                  sortBy === 'title'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sort by Title
              </button>
              <button
                onClick={() => handleSort('date')}
                className={`px-4 py-2 rounded-md ${
                  sortBy === 'date'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sort by Date
              </button>
            </div>
          </div>
        </div>
        
        {feedback && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-green-700">{feedback}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex gap-6 overflow-x-auto">
          <Swimlane
            title="Todo"
            tickets={sortedTickets.filter(ticket => ticket.status === 'Todo')}
            onTicketMove={handleTicketMove}
          />
          <Swimlane
            title="In Progress"
            tickets={sortedTickets.filter(ticket => ticket.status === 'In Progress')}
            onTicketMove={handleTicketMove}
          />
          <Swimlane
            title="Done"
            tickets={sortedTickets.filter(ticket => ticket.status === 'Done')}
            onTicketMove={handleTicketMove}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Board;