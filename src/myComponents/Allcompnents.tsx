import React from 'react';
import Gradient from '@/myComponents/Gradient';
import Hero from '@/myComponents/Hero';
import Contact from '@/myComponents/Contact';
import ContactUs from './ContactUS';
import Navbar from '@/myComponents/Navbar';
import Footer from '@/myComponents/Footer';
import { FAQAccordion } from '@/myComponents/FAQaccordion';
import EventsCalendar from '@/myComponents/EventsCalendar';

const AllComponents = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Gradient Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>


      {/* Main Sections */}
      <Hero />
      <Contact />
      <EventsCalendar/>
      <FAQAccordion/>
      <ContactUs/>

      {/* Footer */}

    </div>
  );
};

export default AllComponents;
