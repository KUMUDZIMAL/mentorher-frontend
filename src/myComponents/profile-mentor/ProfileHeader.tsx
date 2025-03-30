"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, MessageCircle, BriefcaseBusiness, Link2 } from "lucide-react";

// Define the types for mentor and user personal details
interface MentorData {
  id: string;
  fullName?: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  linkedinUrl?: string;
}

interface ProfileHeaderProps {
  mentor: MentorData;
  isOwnProfile?: boolean;
}

const ProfileHeader = ({ mentor, isOwnProfile = false }: ProfileHeaderProps) => {
  // State to hold the logged-in user's details
  const [userData, setUserData] = useState<{ _id?: string; email?: string } | null>(null);
  // State to hold the mentor data from /api/auth/mentordata
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  // Separate loading states
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMentor, setLoadingMentor] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch mentor data on mount
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const res = await fetch("/api/auth/mentordata");
        if (!res.ok) {
          throw new Error("Failed to fetch mentor data");
        }
        const json = await res.json();
        // Extract the actual mentor data from the JSON response
        setMentorData(json.data);
        console.log("Frontend fetched mentor data:", json.data);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoadingMentor(false);
      }
    };

    fetchMentorData();
  }, []);

  // Wait until both user and mentor data are fetched
  if (loadingUser || loadingMentor) {
    return <div>Loading profile...</div>;
  }

  // Merge data, giving priority to mentorData over userData
  const mergedData: MentorData = {
    id: userData?._id || '123',
    fullName: mentorData?.fullName || 'User',
    profilePhoto: mentorData?.profilePhoto || '',
    currentRole: mentorData?.currentRole || '',
    company: mentorData?.company || '',
    linkedinUrl: mentorData?.linkedinUrl || '',
  };

  // Calculate initials for fallback avatar
  const initials = (mergedData.fullName || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative mb-12">
      {/* Cover Photo */}
      <div className="w-full h-64 bg-gradient-to-tr from-primary/30 via-accent/40 to-secondary/20 rounded-xl"></div>
      
      {/* Profile Section */}
      <div className="bg-card rounded-2xl shadow-lg p-6 pb-4 mx-4 -mt-16 border-2 border-background relative z-10">
        {/* Profile Photo */}
        <div className="relative inline-block">
          <Avatar className="w-36 h-36 border-4 border-background absolute -top-24 left-6 shadow-xl ring-4 ring-accent/10">
            {mergedData.profilePhoto ? (
              <AvatarImage src={mergedData.profilePhoto} alt={mergedData.fullName} />
            ) : (
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Edit Button for Own Profile */}
        {isOwnProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute top-4 right-4 hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}

        {/* Profile Info */}
        <div className="mt-20">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{mergedData.fullName}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm">
            {(mergedData.currentRole || mergedData.company) && (
              <div className="flex items-center text-foreground/80 font-medium">
                <BriefcaseBusiness className="h-4 w-4 mr-2 text-primary/70" />
                {mergedData.currentRole && mergedData.company 
                  ? `${mergedData.currentRole} at ${mergedData.company}`
                  : mergedData.currentRole || mergedData.company}
              </div>
            )}
            
            {mergedData.linkedinUrl && (
              <div className="flex items-center text-foreground/80 font-medium">
                <Link2 className="h-4 w-4 mr-2 text-primary/70" />
                <a 
                  href={mergedData.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {!isOwnProfile ? (
              <>
                <Button className="gap-2 rounded-full px-6">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="rounded-full px-6">
                  Connect
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full px-6">
                View as others
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
