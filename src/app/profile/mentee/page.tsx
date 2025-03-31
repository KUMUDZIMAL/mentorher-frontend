'use client';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/myComponents/Navbar";
import ProfileHeader from "../../../myComponents/profile-mentee/ProfileHeader";
import ProfileAbout from "../../../myComponents/profile-mentee/ProfileAbout";
import ProfileSkills from "../../../myComponents/profile-mentee/ProfileSkills";
import ProfileSidebar from "../../../myComponents/profile-mentee/ProfileSidebar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, Target } from "lucide-react";

// Define a complete interface for mentee data
interface MenteeData {
  id: string;
  fullName: string;
  profilePhoto: string;
  currentRole?: string;
  company?: string;
  location?: string;
  linkedinUrl?: string;
  about?: string;
  careerGoals?: string;
  mentorshipGoals?: string;
  challenges?: number;
  technicalBackground?: string;
  preferredMentorshipAreas?: string[];
  skillCategories?: any[]; // Adjust the type as needed
  languages?: string[];
  education?: string[];
  profileViewCount?: number;
}

// In real application, get this from authentication state
const isLoggedInUser = true;
const mockCurrentUser = isLoggedInUser
  ? {
      id: "2",
      fullName: "Emma Watson",
      profilePhoto: "https://randomuser.me/api/portraits/women/22.jpg",
    }
  : null;

const MenteeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [mentee, setMentee] = useState<MenteeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(id === "1"); // For demo purposes
  const { toast } = useToast();

  // Fetch the mentee data based on the id from API
  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const response = await fetch("https://mentorher-backend.vercel.app/api/auth/menteedata",{  credentials: "include",});
        if (!response.ok) {
          throw new Error("Failed to fetch mentee data");
        }
        const json = await response.json();
        setMentee(json.data);
      } catch (error) {
        console.error("Error fetching mentee data:", error);
        toast({
          title: "Error",
          description: "There was an error loading the profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenteeData();
  }, [toast]);

  const handleEditClick = (section: string) => {
    toast({
      title: `Edit ${section}`,
      description: "This functionality will be implemented in a future update.",
    });
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!mentee) {
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="min-h-screen bg-background/40">
      <Navbar  />

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfileHeader

            />

            <ProfileAbout
            
              
            />

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

                {mentee.challenges !== undefined && (
                  <div>
                    <h3 className="font-medium text-lg mb-3">Current Challenges</h3>
                    <p className="text-lg font-light leading-relaxed">{mentee.challenges}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <ProfileSkills
           
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileSidebar
              
              />

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
          <p>© 2023 Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MenteeProfile;
