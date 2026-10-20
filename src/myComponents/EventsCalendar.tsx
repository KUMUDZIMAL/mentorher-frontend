"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Star, Users, AlertTriangle, PlusCircle, CheckCircle2, UserCheck } from "lucide-react";
import RegistrationModal from "./RegistrationModel";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch, errorMessage } from "@/lib/api";

// Define and export the event type
export type EventType = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
  isVirtual: boolean;
  createdBy: string;
  isMine: boolean;
  isRegistered: boolean;
};

type Registrant = {
  fullName: string;
  email: string;
  phone: string;
  isMentor: boolean;
  registeredAt?: string;
};

function RegistrantsModal({
  event,
  onClose,
}: {
  event: EventType;
  onClose: () => void;
}) {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<{ registrations?: Registrant[] }>(
          `/api/registerEvent?eventId=${event.id}`
        );
        if (!cancelled) setRegistrants(res.registrations ?? []);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-1">Registrations</h2>
        <p className="text-sm text-gray-500 mb-4">{event.title}</p>

        {loading && <Loader label="Loading registrations..." />}
        {!loading && error && <p className="text-red-600 text-sm">{error}</p>}
        {!loading && !error && registrants.length === 0 && (
          <p className="text-sm text-gray-500">No registrations yet.</p>
        )}
        {!loading && !error && registrants.length > 0 && (
          <ul className="space-y-3">
            {registrants.map((r, i) => (
              <li key={i} className="border rounded p-3 text-sm">
                <p className="font-medium">{r.fullName}</p>
                <p className="text-gray-500">{r.email}</p>
                <p className="text-gray-500">{r.phone}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    r.isMentor
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {r.isMentor ? "Mentor" : "Mentee"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const EventsCalendar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [registrantEvent, setRegistrantEvent] = useState<EventType | null>(null);
  const [isMentor, setIsMentor] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{ events?: any[] }>("/api/events");
      setEvents(
        (res.events ?? []).map((e) => ({
          id: String(e._id),
          title: e.title,
          date: e.date,
          time: e.time,
          location: e.location ?? "",
          image: e.image ?? "",
          attendees: e.attendees ?? 0,
          category: e.category ?? "Event",
          isVirtual: Boolean(e.isVirtual),
          createdBy: e.createdBy ?? "",
          isMine: Boolean(e.isMine),
          isRegistered: Boolean(e.isRegistered),
        }))
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Mentor check: only mentors see the "Create Event" button
  useEffect(() => {
    if (!user) {
      setIsMentor(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await apiFetch("/api/auth/mentordata");
        if (!cancelled) setIsMentor(true);
      } catch {
        if (!cancelled) setIsMentor(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const visibleEvents = showAll ? events : events.slice(0, 3);

  const handleRegisterClick = (event: EventType) => {
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleRegistration = () => {
    setSelectedEvent(null);
    // Refresh attendee counts after a successful registration
    loadEvents();
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
          {isMentor && (
            <div className="mt-5">
              <Button
                onClick={() => router.push("/create-event")}
                className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Event
              </Button>
            </div>
          )}
        </div>

        {loading && <Loader size="lg" label="Loading events..." />}

        {!loading && error && (
          <EmptyState
            icon={AlertTriangle}
            title="Could not load events"
            description={error}
            action={
              <Button onClick={loadEvents} className="bg-purple-600 text-white hover:bg-purple-700">
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && events.length === 0 && (
          <EmptyState
            title="No events scheduled"
            description="Check back soon for upcoming events, workshops, and webinars."
          />
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg sm:rounded-xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  {event.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.image}
                      alt={event.title}
                      className="transition-transform duration-500 group-hover:scale-110 object-cover w-full h-full"
                    />
                  ) : (
                    <Calendar size={40} className="text-purple-500/70" />
                  )}
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
                    {event.isMine ? (
                      <button
                        onClick={() => setRegistrantEvent(event)}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base inline-flex items-center gap-2"
                      >
                        <UserCheck size={15} />
                        Registrations ({event.attendees})
                      </button>
                    ) : event.isRegistered ? (
                      <span className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-100 text-green-700 rounded-lg font-medium text-sm sm:text-base inline-flex items-center gap-2">
                        <CheckCircle2 size={15} />
                        Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegisterClick(event)}
                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium text-sm sm:text-base"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          {!showAll && events.length > 3 && (
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

      {registrantEvent && (
        <RegistrantsModal
          event={registrantEvent}
          onClose={() => setRegistrantEvent(null)}
        />
      )}
    </section>
  );
};

export default EventsCalendar;
