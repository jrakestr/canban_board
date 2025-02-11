import React from 'react';
import { useDrop } from 'react-dnd';
import TicketCard from './TicketCard';
import { TicketData } from '../interfaces/TicketData';

interface SwimlaneProps {
  title: string;
  tickets: TicketData[];
  onTicketMove: (ticketId: number, newStatus: 'Todo' | 'In Progress' | 'Done') => void;
}

const Swimlane: React.FC<SwimlaneProps> = ({ title, tickets, onTicketMove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ticket',
    drop: (item: { id: number }) => {
      onTicketMove(item.id, title as 'Todo' | 'In Progress' | 'Done');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onTicketMove, title]);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] p-4 rounded-lg ${
        isOver ? 'bg-gray-200' : 'bg-gray-100'
      } transition-colors duration-200`}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default Swimlane;