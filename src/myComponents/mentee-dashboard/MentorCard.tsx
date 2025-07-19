import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface MentorCardProps {
  mentor: {
    name: string;
    image: string;
    role: string;
    company: string;
    rating: number;
    topics: string[];
    availability: 'Available' | 'Busy' | 'Limited';
  };
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const availabilityColors = {
    'Available': 'bg-green-100 text-green-700',
    'Busy': 'bg-red-100 text-red-700',
    'Limited': 'bg-yellow-100 text-yellow-700'
  };
  
  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 border border-pastel-purple/20 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cover bg-center flex-shrink-0" 
             style={{ backgroundImage: `url(${mentor.image})` }} />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{mentor.name}</h4>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {mentor.role} at {mentor.company}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{mentor.rating}</span>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {mentor.topics.map((topic, index) => (
              <span key={index} className="bg-pastel-purple/10 text-purple-700 text-xs px-2 py-1 rounded whitespace-nowrap">
                {topic}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <span className={`text-xs px-2 py-1 rounded-full ${availabilityColors[mentor.availability]} self-start`}>
              {mentor.availability}
            </span>
            
            <Button size="sm" className="bg-gradient-to-r from-pastel-purple to-pastel-pink hover:opacity-90 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 w-full sm:w-auto">
              Request Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;