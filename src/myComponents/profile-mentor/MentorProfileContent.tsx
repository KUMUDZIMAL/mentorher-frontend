"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/myComponents/Navbar";
import ProfileHeader from "@/myComponents/profile-mentor/ProfileHeader";
import ProfileAbout from "@/myComponents/profile-mentor/ProfileAbout";
import ProfileExperience from "@/myComponents/profile-mentor/ProfileExperience";
import ProfileSkills from "@/myComponents/profile-mentor/ProfileSkills";
import ProfileMentorship from "@/myComponents/profile-mentor/ProfileMentorship";
import ProfileSidebar from "@/myComponents/profile-mentor/ProfileSidebar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { mapMentorToProfile, OBJECT_ID_REGEX, MentorProfileViewData } from "@/lib/mentorProfile";
import RequestSessionDialog from "@/myComponents/mentee-dashboard/RequestSessionDialog";
import { AlertTriangle, UserX, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface MentorProfileContentProps {
  /** Mentor user id. Omit to render the logged-in user's own profile. */
  mentorId?: string;
}

type LoadState = "loading" | "ready" | "error";

const MentorProfileContent = ({ mentorId }: MentorProfileContentProps) => {
  const router = useRouter();
  const { status: authStatus, user } = useAuth();

  const [mentor, setMentor] = useState<MentorProfileViewData | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [invalidId, setInvalidId] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const viewingOwnProfile = !mentorId || Boolean(user && mentorId === user._id);
  const targetId = mentorId ?? user?._id;

  const loadProfile = useCallback(async () => {
    if (!targetId) return;
    setState("loading");
    setError("");
    try {
      const data = await apiFetch<{ mentor: any; stats?: { menteeCount: number; completedSessions: number } }>(
        `/api/mentors/${targetId}`
      );
      setMentor(mapMentorToProfile(data.mentor, data.stats));
      setState("ready");
    } catch (err) {
      setError(errorMessage(err));
      setState("error");
    }
  }, [targetId]);

  useEffect(() => {
    if (mentorId && !OBJECT_ID_REGEX.test(mentorId)) {
      setInvalidId(true);
      setState("error");
      setError("This mentor ID is not valid.");
      return;
    }
    setInvalidId(false);
    if (authStatus === "authenticated" && targetId) {
      loadProfile();
    }
  }, [authStatus, targetId, mentorId, loadProfile]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [authStatus, router]);

  const handleEditClick = (section: string) => {
    toast.info(`Edit ${section}`, {
      description: "This functionality will be implemented in a future update.",
    });
  };

  if (authStatus === "loading" || (state === "loading" && !invalidId)) {
    return <Loader fullPage size="lg" label="Loading profile..." />;
  }

  if (state === "error" || !mentor) {
    const notFound = error.toLowerCase().includes("not found");
    return (
      <div className="min-h-screen bg-background/40">
        <Navbar />
        <main className="container py-8">
          {invalidId ? (
            <EmptyState
              icon={AlertTriangle}
              title="Invalid mentor ID"
              description="The link you followed doesn't contain a valid mentor ID."
              action={
                <Button variant="outline" onClick={() => router.push("/find-mentor")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse mentors
                </Button>
              }
            />
          ) : notFound ? (
            <EmptyState
              icon={UserX}
              title="Mentor not found"
              description="This mentor profile doesn't exist or may have been removed."
              action={
                <Button variant="outline" onClick={() => router.push("/find-mentor")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse other mentors
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={AlertTriangle}
              title="Could not load this profile"
              description={error}
              action={
                <Button onClick={loadProfile} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  Try again
                </Button>
              }
            />
          )}
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
            <ProfileHeader
              mentor={mentor}
              isOwnProfile={viewingOwnProfile}
              onEdit={() => handleEditClick("Profile")}
              onMessage={() => router.push(`/chat/${mentor.userId}`)}
            />

            <ProfileAbout personalBio={mentor.personalBio} isOwnProfile={viewingOwnProfile} onEdit={() => handleEditClick("About")} />

            <ProfileExperience
              experiences={mentor.experiences}
              isOwnProfile={viewingOwnProfile}
              onAdd={() => handleEditClick("Experience")}
              onEdit={(id) => handleEditClick(`Experience ${id}`)}
            />

            <ProfileSkills categories={mentor.skillCategories} isOwnProfile={viewingOwnProfile} onEdit={() => handleEditClick("Skills")} />

            <ProfileMentorship
              mentorship={mentor.mentorship}
              isOwnProfile={viewingOwnProfile}
              onEdit={() => handleEditClick("Mentorship")}
              onRequest={() => setRequestOpen(true)}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileSidebar
                languages={mentor.languages}
                achievements={mentor.achievements}
                mentorshipExperience={mentor.mentorshipExperience}
                education={mentor.education}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20 bg-accent/5">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MentorHer — Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>

      {!viewingOwnProfile && (
        <RequestSessionDialog
          open={requestOpen}
          mentorUserId={mentor.userId}
          mentorName={mentor.fullName}
          onClose={() => setRequestOpen(false)}
          onSuccess={() => toast.success("Your session request has been sent.")}
        />
      )}
    </div>
  );
};

export default MentorProfileContent;
