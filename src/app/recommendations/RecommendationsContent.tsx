// app/recommendations/RecommendationsContent.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/myComponents/Navbar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { Users, AlertTriangle } from "lucide-react";

interface Mentor {
  mentorId?: string;
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

type LoadState = "loading" | "ready" | "error";

export default function RecommendationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status: authStatus, user } = useAuth();
  const queryUserId = searchParams.get("userId");
  const userId = queryUserId || user?._id || null;

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    if (!userId) return;
    setState("loading");
    setError(null);
    try {
      const data = await apiFetch<{ recommendations: Recommendation[] }>(
        `/api/recommendations?userId=${userId}`
      );
      setRecommendations(data.recommendations ?? []);
      setState("ready");
    } catch (err) {
      setError(errorMessage(err));
      setState("error");
    }
  }, [userId]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
    if (authStatus === "authenticated" && userId) {
      loadRecommendations();
    }
  }, [authStatus, userId, loadRecommendations, router]);

  const showLoader = authStatus === "loading" || (state === "loading" && !error);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-transparent">
      <Navbar />
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/30 backdrop-blur-lg shadow-lg p-6 rounded-lg max-w-3xl w-full mt-28 mb-12">
        <h1 className="text-2xl font-bold mb-6 text-center">Mentor Recommendations</h1>

        {showLoader ? (
          <Loader size="lg" label="Finding your best mentor matches..." />
        ) : state === "error" ? (
          <EmptyState
            icon={AlertTriangle}
            title="Could not load recommendations"
            description={error ?? "Something went wrong while fetching mentors."}
            action={
              <Button
                onClick={loadRecommendations}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Try again
              </Button>
            }
          />
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No mentor recommendations yet"
            description="There are no mentors matching your profile right now. Complete your mentee profile and check back later."
            action={
              <Button variant="outline" onClick={() => router.push("/find-mentor")}>
                Browse all mentors
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li
                key={rec.mentor.userId || index}
                className="p-4 border rounded-lg flex items-center space-x-4 shadow-sm bg-white/30 backdrop-blur-lg cursor-pointer transition transform hover:scale-[1.02] hover:shadow-xl hover:bg-white/40 hover:ring-2 hover:ring-purple-300"
                onClick={() => router.push(`/profile/mentor/${rec.mentor.userId}`)}
              >
                {rec.mentor.profilePhoto ? (
                  <img
                    src={rec.mentor.profilePhoto}
                    alt={rec.mentor.fullName}
                    className="w-16 h-16 rounded-full object-cover bg-purple-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-semibold">
                    {rec.mentor.fullName?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{rec.mentor.fullName}</h2>
                  <p className="text-gray-700">
                    {rec.mentor.currentRole}
                    {rec.mentor.company && ` at ${rec.mentor.company}`}
                  </p>
                  {rec.mentor.technicalSkills && rec.mentor.technicalSkills.length > 0 && (
                    <p className="text-sm text-gray-600 truncate">
                      Skills: {rec.mentor.technicalSkills.join(", ")}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Similarity Score: {(rec.similarity * 100).toFixed(2)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
