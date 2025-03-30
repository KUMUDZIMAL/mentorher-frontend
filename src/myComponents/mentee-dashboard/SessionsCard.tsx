import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SessionCardProps {
  mentor: {
    name: string;
    image: string;
    expertise: string;
  };
  date: string;
  time: string;
  description: string;
  status: 'upcoming' | 'completed' | 'canceled';
}

const SessionCard = ({ mentor, date, time, description, status }: SessionCardProps) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-pastel-purple/20 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-cover bg-center mr-3" 
               style={{ backgroundImage: `url(${mentor.image})` }} />
          <div>
            <h4 className="font-semibold text-gray-800">{mentor.name}</h4>
            <p className="text-sm text-gray-500">{mentor.expertise}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        {date}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Clock className="h-4 w-4 mr-2" />
        {time}
      </div>
      
      <p className="text-gray-700 text-sm italic">"{description}"</p>
    </div>
  );
};

export default SessionCard;