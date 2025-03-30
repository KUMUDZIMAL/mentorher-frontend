   // components/SendNotification.tsx
   "use client";

   import React, { useState } from 'react';
   import { Send } from 'lucide-react';
   import { useNotification } from './NotificationContext';
   
   interface SendNotificationProps {
     currentUserId: string;
     currentUserName: string;
     mentorId: string;
   }
   
   export const SendNotification: React.FC<SendNotificationProps> = ({ 
     currentUserId, 
     currentUserName, 
     mentorId 
   }) => {
     const [message, setMessage] = useState('');
     const { addNotification } = useNotification();
   
     const handleSendNotification = () => {
       if (message.trim()) {
         // In a real app, you'd also send this to your backend
         addNotification({
           senderId: currentUserId,
           senderName: currentUserName,
           message: message
         });
         setMessage('');
       }
     };
   
     return (
       <div className="bg-white shadow-md rounded-lg p-6">
         <h2 className="text-xl font-semibold mb-4">Send Notification to Mentor</h2>
         <textarea 
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           className="w-full h-32 p-3 border rounded-lg mb-4"
           placeholder="Write your mentorship request or message..."
         />
         <button 
           onClick={handleSendNotification}
           className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
         >
           <Send className="mr-2" size={20} />
           Send Notification
         </button>
       </div>
     );
   };
   
