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
    <div className="bg-white rounded-lg p-4 sm:p-5 border border-pastel-purple/20 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center mr-3 flex-shrink-0" 
               style={{ backgroundImage: `url(${mentor.image})` }} />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{mentor.name}</h4>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{mentor.expertise}</p>
          </div>
        </div>
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} self-start sm:self-auto`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
        <span className="truncate">{date}</span>
      </div>
      
      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
        <span className="truncate">{time}</span>
      </div>
      
      <p className="text-gray-700 text-xs sm:text-sm italic leading-relaxed">"{description}"</p>
    </div>
  );
};

export default SessionCard;