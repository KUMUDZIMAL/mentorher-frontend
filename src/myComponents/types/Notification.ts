// types/Notification.ts
export interface Notification {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  status: 'unread' | 'read';
}