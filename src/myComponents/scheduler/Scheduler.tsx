"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { apiFetch, errorMessage } from "@/lib/api";

interface Mentor {
  userId: string;
  fullName: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  technicalSkills?: string[];
  areasOfInterest?: string[];
  availability?: { day?: string; startTime?: string; endTime?: string }[];
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  const expertise = [...(mentor.technicalSkills ?? []), ...(mentor.areasOfInterest ?? [])];
  const isAvailable = (mentor.availability?.length ?? 0) > 0;
  const initials = mentor.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border border-white/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/25 backdrop-blur-xl hover:bg-white/35 hover:scale-[1.03] group">
      <div className="w-full h-56 relative mb-5 rounded-lg overflow-hidden shadow-inner bg-white/50 flex items-center justify-center">
        {mentor.profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mentor.profilePhoto}
            alt={mentor.fullName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl font-bold text-purple-500/70">{initials}</span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-center">{mentor.fullName}</h3>
      <p className="text-center text-sm mt-1">
        {mentor.currentRole || "Mentor"}
        {mentor.company ? ` @ ${mentor.company}` : ""}
      </p>
      <div className="my-3 p-2 rounded-lg bg-white/30 backdrop-blur-md">
        <p className="text-center text-xs text-gray-700">
          {expertise.length > 0 ? `Expertise: ${expertise.slice(0, 4).join(", ")}` : "Skills not listed yet"}
        </p>
      </div>
      <div className="flex justify-center mb-4 px-2">
        <p
          className={`${isAvailable ? "text-green-600 bg-green-100/70" : "text-gray-500 bg-gray-100/70"} px-3 py-1 rounded-full text-sm backdrop-blur-sm`}
        >
          {isAvailable ? "Available for sessions" : "Availability not set"}
        </p>
      </div>
      <a
        href={`/profile/mentor/${mentor.userId}`}
        className="block text-center bg-purple-600/80 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
      >
        View Profile &amp; Schedule
      </a>
    </div>
  );
}

export default function SchedulerPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMentors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const json = await apiFetch<{ success: boolean; mentors?: Mentor[] }>("/api/mentors");
      setMentors(json.mentors ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  return (
    <div className="scheduler-container min-h-screen relative overflow-hidden">
      {/* Animated background with more visible soft blurred circles */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
        <div className="absolute -top-40 -left-40 w-[70rem] h-[70rem] bg-purple-500/40 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-0 w-[60rem] h-[60rem] bg-pink-500/40 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-[70rem] h-[70rem] bg-blue-500/40 rounded-full blur-[120px] animate-pulse-slow animation-delay-4000"></div>
        <div className="absolute top-2/3 right-1/4 w-[55rem] h-[55rem] bg-purple-400/35 rounded-full blur-[120px] animate-pulse-slow animation-delay-3000"></div>
        <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-indigo-400/30 rounded-full blur-[100px] animate-pulse-slow animation-delay-1000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center">
              Connect with <span className="text-purple-600">Women in Tech</span>
            </h1>
            <p className="text-lg mb-8 text-gray-800 text-center max-w-2xl mx-auto">
              Personalized mentorship to accelerate your career growth. Find the perfect mentor to guide you through
              your tech journey.
            </p>
            <div className="flex justify-center">
              <Button
                className="bg-purple-600/90 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm px-6 py-6"
                onClick={() => document.getElementById("mentors-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse All Mentors <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid Section */}
      <section id="mentors-grid" className="relative px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Featured Mentors</h2>

          {loading && <Loader size="lg" label="Loading mentors..." />}

          {!loading && error && (
            <EmptyState
              icon={AlertTriangle}
              title="Could not load mentors"
              description={error}
              action={
                <Button onClick={loadMentors} className="bg-purple-600 text-white hover:bg-purple-700">
                  Try again
                </Button>
              }
            />
          )}

          {!loading && !error && mentors.length === 0 && (
            <EmptyState
              title="No mentors yet"
              description="No mentor profiles have been created. Check back soon."
            />
          )}

          {!loading && !error && mentors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.userId} mentor={mentor} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
