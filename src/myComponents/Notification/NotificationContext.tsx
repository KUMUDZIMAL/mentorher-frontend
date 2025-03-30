'use client';

import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode 
} from 'react';
import { Notification } from '../types/Notification';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => void;
    markAsRead: (notificationId: string) => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (newNotification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
        const notification: Notification = {
            ...newNotification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            status: 'unread'
        };
        setNotifications(prev => [notification, ...prev]);
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, status: 'read' } 
                    : notification
            )
        );
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <NotificationContext.Provider 
            value={{ 
                notifications, 
                addNotification, 
                markAsRead,
                unreadCount 
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};  
