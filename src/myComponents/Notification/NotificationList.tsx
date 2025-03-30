"use client";

import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { useNotification } from './NotificationContext';

export const NotificationList: React.FC = () => {
  const { notifications, markAsRead, unreadCount } = useNotification();

  return (
    <div 
      className="
        bg-white/30 backdrop-blur-lg 
        rounded-2xl 
        border border-white/20 
        shadow-2xl 
        overflow-hidden
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
        <h2 className="text-xl font-semibold flex items-center text-purple-800">
          <Bell className="mr-2 text-blue-600" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h2>
      </div>

      {/* Notification Content */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-600 p-4">
            No notifications
          </p>
        ) : (
          <div className="space-y-2 p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 rounded-lg 
                  ${
                    notification.status === 'unread'
                      ? 'bg-blue-100/20 hover:bg-blue-200/30 border-blue-200/20'
                      : 'bg-gray-100/10 hover:bg-gray-200/20 border-gray-200/20'
                  }
                  border
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
                <div className="text-xs text-gray-600 flex justify-between items-center">
                  <span>{notification.timestamp.toLocaleString()}</span>
                  {notification.status === 'read' && (
                    <CheckCircle className="text-green-500" size={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};