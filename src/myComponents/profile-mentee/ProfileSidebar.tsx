"use client";
import { API_BASE } from "@/lib/api";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Medal, GraduationCap, Languages, ArrowUpRight, AlertTriangle } from "lucide-react";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenteeData {
  languages?: string[];
  achievements?: string[];
  mentorshipExperience?: string;
  profileViewCount?: number;
  education?: string;
}

const ProfileSidebar: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<MenteeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from the API endpoint
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/menteedata`,{  credentials: "include",});
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || "Failed to load profile data");
          return;
        }
        // Extract the sidebar fields from the fetched data
        setData({
          languages: result.data.languages || [],
          achievements: result.data.achievements || [],
          mentorshipExperience: result.data.mentorshipExperience || "",
          profileViewCount: result.data.profileViewCount || 0,
          education: result.data.education || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <Loader size="lg" label="Loading details..." />;
  if (error) return <EmptyState icon={AlertTriangle} title="Could not load details" description={error} />;
  if (!data) return null;

  const { languages, achievements = [], mentorshipExperience, education } = data;

  return (
    <div className="space-y-6">
      {/* Languages */}
      {languages && languages.length > 0 && (
        <Card className="overflow-hidden border-2 border-accent/30">
          <CardContent className="p-5">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Languages className="h-5 w-5 text-primary/70" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <Badge 
                  key={language} 
                  className="px-3 py-1.5 text-sm bg-accent/20 border-accent/20 text-foreground rounded-full"
                >
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Education */}
      {education && (
        <Card className="overflow-hidden border-2 border-accent/30">
          <CardContent className="p-5">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-primary/70" />
              Education
            </h3>
            <p className="text-base leading-relaxed">{education}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <Card className="overflow-hidden border-2 border-accent/30">
          <CardContent className="p-5">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Medal className="h-5 w-5 text-primary/70" />
              Achievements
            </h3>
            <ul className="space-y-2 text-base">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Mentorship Experience */}
      {mentorshipExperience && (
        <Card className="overflow-hidden border-2 border-accent/30">
          <CardContent className="p-5">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary/70" />
              Mentorship Experience
            </h3>
            <p className="text-base leading-relaxed">{mentorshipExperience}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Call to Action */}
      <Card className="overflow-hidden border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-medium text-lg mb-3">Join our community</h3>
          <p className="text-base text-foreground/80 mb-4">
            Connect with other mentors and mentees in the Women in Tech community
          </p>
          <Button
            className="w-full rounded-full flex items-center gap-2 py-5 text-base"
            onClick={() => router.push("/forum")}
          >
            Join Community
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
