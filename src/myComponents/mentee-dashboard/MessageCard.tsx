import React from 'react';

interface MessageCardProps {
  sender: {
    name: string;
    image: string;
  };
  time: string;
  content: string;
  unread?: boolean;
}

const MessageCard = ({ sender, time, content, unread = false }: MessageCardProps) => {
  return (
    <div className={`p-3 sm:p-4 mb-2 rounded-lg ${unread ? 'bg-pastel-purple/5' : 'bg-white'} border border-pastel-purple/20 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
        <div className="flex items-center min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cover bg-center mr-3 flex-shrink-0" 
               style={{ backgroundImage: `url(${sender.image})` }} />
          <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{sender.name}</h4>
        </div>
        <span className="text-xs text-gray-500 self-start sm:self-auto">{time}</span>
      </div>
      
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{content}</p>
      
      {unread && (
        <div className="mt-2 flex justify-end">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default MessageCard;