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
    <div className={`p-4 mb-2 rounded-lg ${unread ? 'bg-pastel-purple/5' : 'bg-white'} border border-pastel-purple/20`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-cover bg-center mr-3" 
               style={{ backgroundImage: `url(${sender.image})` }} />
          <h4 className="font-medium text-gray-800">{sender.name}</h4>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      
      <p className="text-sm text-gray-600">{content}</p>
      
      {unread && (
        <div className="mt-2 flex justify-end">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default MessageCard;