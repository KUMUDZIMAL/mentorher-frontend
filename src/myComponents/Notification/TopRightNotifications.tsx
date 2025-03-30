'use client';

import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotification } from './NotificationContext';

export const TopRightNotifications: React.FC = () => {
  const { notifications, markAsRead, unreadCount } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell Icon */}
      <div 
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell 
          className={`
            w-8 h-8 
            ${unreadCount > 0 ? 'text-pink-500' : 'text-blue-500'}
            hover:text-purple-500 
            transition-colors
          `}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Glassmorphic Notification Dropdown */}
      {isOpen && (
        <div 
          className="
            absolute top-12 right-0 
            w-80 max-h-96 
            bg-white/30 backdrop-blur-lg 
            rounded-2xl 
            border border-white/20 
            shadow-2xl 
            overflow-hidden
            z-50
          "
        >
          {/* Header */}
          <div 
            className="
              flex justify-between items-center 
              p-4 
              bg-gradient-to-r from-pink-200/50 to-blue-200/50
            "
          >
            <h2 className="text-lg font-semibold text-purple-800">
              Notifications
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-purple-600 hover:text-purple-800"
            >
              <X size={24} />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-600 p-4">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`
                    p-4 
                    border-b border-white/20
                    ${notification.status === 'unread' 
                      ? 'bg-blue-100/20 hover:bg-blue-200/30' 
                      : 'bg-gray-100/10 hover:bg-gray-200/20'}
                    transition-colors
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-purple-900">
                      {notification.senderName}
                    </h3>
                    {notification.status === 'unread' && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-pink-600 hover:text-pink-800 text-sm"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800 mb-2">
                    {notification.message}
                  </p>
                  <div className="text-xs text-gray-600">
                    {notification.timestamp.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
