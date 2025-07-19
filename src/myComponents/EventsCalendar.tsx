"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Calendar, Star, Users } from "lucide-react";
import RegistrationModal from "./RegistrationModel";

// Define and export the event type
export type EventType = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
  isVirtual: boolean;
};

const upcomingEvents: EventType[] = [
  {
    id: 1,
    title: "AI & Machine Learning Conference 2025",
    date: "March 29 - 30, 2025",
    time: "10:00 AM - 5:00 PM",
    location: "San Francisco & Virtual",
    image: "/events/event1.jpeg",
    attendees: 850,
    category: "Conference",
    isVirtual: true,
  },
  {
    id: 2,
    title: "Next.js & React Workshop",
    date: "March 30, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Virtual",
    image: "/events/event2.jpeg",
    attendees: 620,
    category: "Workshop",
    isVirtual: true,
  },
  {
    id: 3,
    title: "Full Stack Bootcamp 2025",
    date: "April 5, 2025",
    time: "9:00 AM - 4:00 PM",
    location: "New York & Virtual",
    image: "/events/event3.jpeg",
    attendees: 700,
    category: "Bootcamp",
    isVirtual: true,
  },
];

const EventsCalendar: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const visibleEvents = showAll ? upcomingEvents : upcomingEvents.slice(0, 3);

  const handleRegisterClick = (event: EventType) => {
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleRegistration = (formData: any) => {
    console.log("Registered:", formData);
    // Optionally close the modal or perform additional actions after registration.
  };

  return (
    <section id="events" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4 backdrop-blur-sm">
            Upcoming Events
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Events &{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Webinars
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
            Expand your network and knowledge with our curated events, workshops, and networking opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-lg sm:rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="transition-transform duration-500 group-hover:scale-110 object-cover"
                />
                {event.isVirtual && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full shadow-md">
                    Virtual
                  </div>
                )}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-md">
                  {event.category}
                </div>
              </div>

              <div className="p-4 sm:p-5 backdrop-blur-sm">
                <h3 className="font-semibold text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-purple-500 transition-colors duration-300 leading-tight">
                  {event.title}
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start">
                    <Calendar size={14} className="text-pink-500 mt-0.5 mr-2 sm:mr-2.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium">{event.date}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users size={14} className="text-blue-500 mr-2 sm:mr-2.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted-foreground">{event.attendees} attending</p>
                  </div>

                  <div className="flex items-center">
                    <Star size={14} className="text-purple-500 mr-2 sm:mr-2.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-5 text-center">
                  <button
                    onClick={() => handleRegisterClick(event)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-foreground font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <Calendar size={16} className="mr-2 text-purple-500" />
              View More Events
            </button>
          )}
        </div>
      </div>

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={handleModalClose}
          onRegister={handleRegistration}
        />
      )}
    </section>
  );
};

export default EventsCalendar;
