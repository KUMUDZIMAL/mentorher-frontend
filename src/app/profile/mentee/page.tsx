'use client';
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/myComponents/Navbar";
import ProfileHeader from "../../../myComponents/profile-mentee/ProfileHeader";
import ProfileAbout from "../../../myComponents/profile-mentee/ProfileAbout";
import ProfileSkills from "../../../myComponents/profile-mentee/ProfileSkills";
import ProfileSidebar from "../../../myComponents/profile-mentee/ProfileSidebar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, Target, AlertTriangle } from "lucide-react";
import { apiFetch, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

// Shape of the real mentee document returned by /api/auth/menteedata
interface MenteeData {
  fullName?: string;
  careerGoals?: string;
  mentorshipGoals?: string;
  challenges?: string;
  technicalBackground?: string;
  preferredMentorshipAreas?: string[];
}

type LoadState = "loading" | "ready" | "error";

const MenteeProfile = () => {
  const { status: authStatus } = useAuth();
  const [mentee, setMentee] = useState<MenteeData | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  const loadMentee = useCallback(async () => {
    setState("loading");
    try {
      const json = await apiFetch<{ success: boolean; data?: MenteeData }>("/api/auth/menteedata");
      if (json.success && json.data) {
        setMentee(json.data);
        setState("ready");
      } else {
        setError("No mentee profile found.");
        setState("error");
      }
    } catch (err) {
      setError(errorMessage(err));
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") loadMentee();
    if (authStatus === "unauthenticated") {
      setState("error");
      setError("You need to be logged in to view this profile.");
    }
  }, [authStatus, loadMentee]);

  if (authStatus === "loading" || state === "loading") {
    return <Loader fullPage size="lg" label="Loading profile..." />;
  }

  if (state === "error" || !mentee) {
    const notAuth = authStatus === "unauthenticated";
    return (
      <div className="min-h-screen bg-background/40">
        <Navbar />
        <main className="container py-16">
          <EmptyState
            icon={AlertTriangle}
            title={notAuth ? "Please log in" : "Could not load your profile"}
            description={error || undefined}
            action={
              notAuth ? (
                <Button onClick={() => (window.location.href = "/auth/login")} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Go to Login
                </Button>
              ) : (
                <Button onClick={loadMentee} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Try again
                </Button>
              )
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/40">
      <Navbar />

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfileHeader />

            <ProfileAbout />

            <Card className="mb-6 overflow-hidden border-2 border-accent/30">
              <CardHeader className="pb-3 bg-accent/10">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary/70" />
                  Career & Mentorship Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                {mentee.careerGoals && (
                  <div>
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                      <GraduationCap className="h-5 w-5 text-primary/70" />
                      Career Goals
                    </h3>
                    <p className="text-lg font-light leading-relaxed">{mentee.careerGoals}</p>
                  </div>
                )}

                {mentee.mentorshipGoals && (
                  <div>
                    <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                      <Book className="h-5 w-5 text-primary/70" />
                      Mentorship Goals
                    </h3>
                    <p className="text-lg font-light leading-relaxed">{mentee.mentorshipGoals}</p>
                  </div>
                )}

                {mentee.challenges && (
                  <div>
                    <h3 className="font-medium text-lg mb-3">Current Challenges</h3>
                    <p className="text-lg font-light leading-relaxed">{mentee.challenges}</p>
                  </div>
                )}

                {!mentee.careerGoals && !mentee.mentorshipGoals && !mentee.challenges && (
                  <EmptyState
                    title="No goals added yet"
                    description="Complete your mentee profile to share your career and mentorship goals."
                  />
                )}
              </CardContent>
            </Card>

            <ProfileSkills />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileSidebar />

              {/* Areas of Interest Card */}
              {mentee.preferredMentorshipAreas &&
                mentee.preferredMentorshipAreas.length > 0 && (
                  <Card className="overflow-hidden border-2 border-accent/30 mt-6">
                    <CardContent className="p-5">
                      <h3 className="font-medium text-lg mb-3">Seeking Mentorship In</h3>
                      <div className="flex flex-wrap gap-2">
                        {mentee.preferredMentorshipAreas.map((area) => (
                          <div
                            key={area}
                            className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 rounded-full"
                          >
                            {area}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Technical Background Card */}
              {mentee.technicalBackground && (
                <Card className="overflow-hidden border-2 border-accent/30 mt-6">
                  <CardContent className="p-5">
                    <h3 className="font-medium text-lg mb-3">Technical Background</h3>
                    <p className="text-base leading-relaxed">{mentee.technicalBackground}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20 bg-accent/5">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MentorHer — Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MenteeProfile;
