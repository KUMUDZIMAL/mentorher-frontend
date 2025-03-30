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
    <div className="bg-white rounded-lg p-5 border border-pastel-purple/20 mb-4">
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-cover bg-center mr-4" 
             style={{ backgroundImage: `url(${mentor.image})` }} />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">{mentor.name}</h4>
              <p className="text-sm text-gray-500">
                {mentor.role} at {mentor.company}
              </p>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{mentor.rating}</span>
            </div>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {mentor.topics.map((topic, index) => (
              <span key={index} className="bg-pastel-purple/10 text-purple-700 text-xs px-2 py-1 rounded">
                {topic}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${availabilityColors[mentor.availability]}`}>
              {mentor.availability}
            </span>
            
            <Button size="sm" className="bg-gradient-to-r from-pastel-purple to-pastel-pink hover:opacity-90">
              Request Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;