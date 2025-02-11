import React from 'react';
import { useDrag } from 'react-dnd';
import { useNavigate } from 'react-router-dom';
import { TicketData } from '../interfaces/TicketData';

interface TicketCardProps {
  ticket: TicketData;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ticket',
    item: { id: ticket.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [ticket.id]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag when clicking the button
    navigate(`/edit/${ticket.id}`);
  };

  return (
    <div
      ref={drag}
      className={`p-4 bg-white rounded-lg shadow cursor-move transform transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } hover:shadow-md`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold mb-2">{ticket.title}</h3>
        <button
          onClick={handleEdit}
          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
        >
          Edit
        </button>
      </div>
      <p className="text-sm text-gray-600">{ticket.description}</p>
      <div className="mt-2 text-xs text-gray-500">
        {ticket.created_at && new Date(ticket.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TicketCard;