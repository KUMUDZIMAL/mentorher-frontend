import React from 'react';
import Hero from '@/myComponents/Hero';
import Contact from '@/myComponents/Contact';
import ContactUs from './ContactUS';
import { FAQAccordion } from '@/myComponents/FAQaccordion';
import EventsCalendar from '@/myComponents/EventsCalendar';

const AllComponents = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Gradient Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[17rem] sm:w-[25rem] lg:w-[35rem] h-[17rem] sm:h-[25rem] lg:h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-[15rem] sm:w-[20rem] lg:w-[30rem] h-[15rem] sm:h-[20rem] lg:h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Main Sections */}
      <Hero />
      <Contact />
      <EventsCalendar/>
      <FAQAccordion/>
      <ContactUs/>
    </div>
  );
};

export default AllComponents;
