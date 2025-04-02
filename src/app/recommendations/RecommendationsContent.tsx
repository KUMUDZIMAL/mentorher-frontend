// app/recommendations/RecommendationsContent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/myComponents/Navbar";

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

export default function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menteeData, setMenteeData] = useState<any>(null);

  // Fetch mentee data on mount.
  useEffect(() => {
    async function fetchMenteeData() {
      if (!userId) {
        router.push("/Become-mentee");
        return;
      }
      try {
        const res = await fetch("https://mentorher-backend.vercel.app/api/auth/menteedata", { credentials: "include" });
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setMenteeData(json.data);
          // Stay on the same page as we're using query parameters.
        } else {
          router.push("/Become-mentee");
        }
      } catch (error) {
        console.error("Error fetching mentee data:", error);
        router.push("/Become-mentee");
      } finally {
        setLoading(false);
      }
    }
    fetchMenteeData();
  }, [router, userId]);

  // Fetch recommendations based on userId.
  useEffect(() => {
    async function fetchRecommendations() {
      if (!userId) {
        setError("No userId provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://mentorher-backend.vercel.app/api/recommendations?userId=${userId}`, { credentials: "include" });
        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await res.json();
        setRecommendations(data.recommendations);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!loading && recommendations.length === 0) {
    return (
      <div className="container mx-auto py-8">
        No mentor recommendations found.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-transparent">
      <Navbar />
      <div className="fixed inset-0 z-[-1] overflow-hidden mt-10">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>
      <div className="bg-white/30 backdrop-blur-lg shadow-lg p-6 rounded-lg max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Mentor Recommendations</h1>
        <ul className="space-y-4">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg flex items-center space-x-4 shadow-sm bg-white/30 backdrop-blur-lg cursor-pointer transition transform hover:scale-105 hover:shadow-xl hover:bg-white/40 hover:ring-2 hover:ring-purple-300"
              onClick={() => router.push(`/mentor/${rec.mentor.userId}`)}
            >
              {rec.mentor.profilePhoto && (
                <img
                  src={rec.mentor.profilePhoto}
                  alt={rec.mentor.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{rec.mentor.fullName}</h2>
                <p className="text-gray-700">
                  {rec.mentor.currentRole} {rec.mentor.company && `at ${rec.mentor.company}`}
                </p>
                <p className="text-gray-600">Email: {rec.mentor.email}</p>
                <p className="text-sm text-gray-500">
                  Similarity Score: {(rec.similarity * 100).toFixed(2)}%
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
