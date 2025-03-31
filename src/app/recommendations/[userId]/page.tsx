"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/myComponents/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

interface Mentor {
  userId: string;
  fullName: string;
  email: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  mentoringGoals?: string;
  technicalSkills?: string[];
  areasOfInterest?: string[];
}

interface Recommendation {
  similarity: number;
  mentor: Mentor;
}

const RecommendationsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menteeRes, recRes] = await Promise.all([
          fetch("https://mentorher-backend.vercel.app/api/auth/menteedata", {
            credentials: "include",
          }),
          fetch(`https://mentorher-backend.vercel.app/api/recommendations/${userId}`)
        ]);

        if (!menteeRes.ok) {
          router.push(menteeRes.status === 401 ? "/auth/login" : "/Become-mentee");
          return;
        }

        if (!recRes.ok) {
          throw new Error(`HTTP error! status: ${recRes.status}`);
        }

        const menteeData = await menteeRes.json();
        const recData = await recRes.json();

        if (!menteeData?.success) {
          router.push("/Become-mentee");
          return;
        }

        setRecommendations(recData.recommendations || []);
      } catch (err: any) {
        setError(err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton count={5} /> {/* Implement skeleton loading */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        <div className="alert alert-error max-w-2xl">
          <span>Error: {error}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Personalized Mentor Matches
          </h1>

          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No mentors found matching your profile.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => router.push("/Become-mentee")}
              >
                Update Your Profile
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.mentor.userId}
                  className="group relative p-6 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 ease-in-out hover:shadow-lg bg-white"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {rec.mentor.profilePhoto && (
                      <img
                        src={rec.mentor.profilePhoto}
                        alt={rec.mentor.fullName}
                        className="w-24 h-24 rounded-full object-cover shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {rec.mentor.fullName}
                        <span className="ml-3 text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                          Match: {(rec.similarity * 100).toFixed(1)}%
                        </span>
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.mentor.technicalSkills?.map((skill, i) => (
                          <span
                            key={i}
                            className="badge badge-outline badge-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {rec.mentor.currentRole}
                        {rec.mentor.company && ` @ ${rec.mentor.company}`}
                      </p>
                      <p className="text-gray-600 mb-4">
                        {rec.mentor.mentoringGoals}
                      </p>
                      <div className="flex gap-4">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => router.push(`/mentor/${rec.mentor.userId}`)}
                        >
                          View Profile
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => router.push(`/schedule/${rec.mentor.userId}`)}
                        >
                          Schedule Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;