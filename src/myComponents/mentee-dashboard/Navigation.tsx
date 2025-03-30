import React from 'react';
import { Bell, Home, MessageCircle, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const Navigation = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">
            <span className="text-gray-800">Mentor</span>
            <span className="text-purple-500">Her</span>
 
          </h1>
          
          <div className="ml-8 relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center">
          <ul className="flex items-center space-x-8">
            <li>
              <a href="#" className="flex flex-col items-center text-gray-500 hover:text-purple-500">
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex flex-col items-center text-gray-500 hover:text-purple-500">
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">My Network</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex flex-col items-center text-gray-500 hover:text-purple-500">
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs mt-1">Messaging</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex flex-col items-center text-gray-500 hover:text-purple-500">
                <Bell className="h-5 w-5" />
                <span className="text-xs mt-1">Notifications</span>
              </a>
            </li>
          </ul>
          
          <div className="ml-8">
            <Avatar>
              <div className="w-9 h-9 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)' }} />
            </Avatar>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;