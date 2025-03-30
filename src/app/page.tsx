import React from 'react'; 
import Gradient from '@/myComponents/Gradient'; 
import Navbar from '@/myComponents/Navbar'; 
import Footer from '@/myComponents/Footer'; 
import { FAQAccordion } from '@/myComponents/FAQaccordion';  
import EventsCalendar from '@/myComponents/EventsCalendar'; 
import AICareerPathGenerator from '@/myComponents/AICareerPathGenerator'; 
import AllComponents from '@/myComponents/Allcompnents'; 
import { NotificationProvider } from '../myComponents/Notification/NotificationContext'; 
import { SendNotification } from '../myComponents/Notification/SendNotification'; 
import { TopRightNotifications } from '../myComponents/Notification/TopRightNotifications';
import { NotificationList } from '../myComponents/Notification/NotificationList';
import ContactUs from '@/myComponents/ContactUS';

const Index = () => {   
  return (     
    // <NotificationProvider>
      <div className="relative">
        {/* Navbar */}
        <Navbar />
        <Gradient />
        <AllComponents />
        <Footer />
      </div>
    /* </NotificationProvider> */
  ); 
}; 

export default Index;
