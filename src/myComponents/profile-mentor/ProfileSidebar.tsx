"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users, Medal, GraduationCap, Languages, ArrowUpRight } from "lucide-react";

interface MentorData {
  languages: string[];
  achievements?: string[];
  mentorshipExperience?: string;
  profileViewCount?: number;
  education?: string;
}

const ProfileSidebar = () => {
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const res = await fetch("/api/auth/mentordata");
        if (!res.ok) {
          throw new Error("Failed to fetch mentor data");
        }
        const json = await res.json();
        const data = json.data;
        // Map fetched data to the MentorData interface
        const mappedData: MentorData = {
          languages: data.languages || [],
          achievements: data.achievements ? [data.achievements] : [], // if achievements is a string
          mentorshipExperience: data.mentorshipExperience || "",
          profileViewCount: data.profileViewCount || 0, // default to 0 if not provided
          education: data.education || ""
        };
        setMentorData(mappedData);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  if (loading) return <div>Loading sidebar...</div>;
  if (!mentorData) return <div>No mentor data found</div>;

  const { languages, achievements = [], mentorshipExperience, profileViewCount = 0, education } = mentorData;

  return (
    <div className="space-y-6">
      {/* Profile Activity */}
      <Card className="overflow-hidden border-2 border-accent/30">
        <CardContent className="p-5">
          <h3 className="font-medium text-lg mb-3">Profile Activity</h3>
          <div className="flex items-center gap-2 text-base text-foreground/80">
            <Eye className="h-5 w-5 text-primary/70" />
            <span>{profileViewCount} profile views</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Languages */}
      {languages.length > 0 && (
        <Card className="overflow-hidden border-2 border-accent/30">
          <CardContent className="p-5">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Languages className="h-5 w-5 text-primary/70" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map(language => (
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
      {achievements.length > 0 && (
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
          <Button className="w-full rounded-full flex items-center gap-2 py-5 text-base">
            Join Community
            <ArrowUpRight className="h-4 w-4" />  
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
