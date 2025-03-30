"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, MessageCircle, BriefcaseBusiness, Award, MapPin, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MentorData {
  id: string;
  fullName: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  location?: string;
  connectionCount?: number;
  headline?: string;
  linkedinUrl?: string;
  verified?: boolean;
}

const ProfileHeader: React.FC = () => {
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const res = await fetch("/api/auth/menteedata");
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || "Failed to load profile data");
          return;
        }
        // Expecting API to return { success: true, data: mentor }
        setMentor(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!mentor) return <div>No profile data found.</div>;

  const {
    fullName,
    profilePhoto,
    currentRole,
    company,
    location,
    connectionCount = 0,
    headline,
    linkedinUrl,
    verified = false,
  } = mentor;

  const initials = fullName
    .split(" ")
    .map((name) => name[0])
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
            <AvatarImage src={profilePhoto} alt={fullName} />
            <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Edit Button (shown if it's the user's own profile) */}
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-4 right-4 hover:bg-accent hover:text-accent-foreground"
          onClick={() => toast.success("Edit Profile functionality coming soon!")}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>

        {/* Profile Info */}
        <div className="mt-20">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{fullName}</h1>
            {verified && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Award className="h-3.5 w-3.5 mr-1" />
                Verified Mentor
              </Badge>
            )}
          </div>
          
          {headline && (
            <p className="text-muted-foreground mt-2 text-lg font-light leading-relaxed">
              {headline}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm">
            {(currentRole || company) && (
              <div className="flex items-center text-foreground/80 font-medium">
                <BriefcaseBusiness className="h-4 w-4 mr-2 text-primary/70" />
                {currentRole && company 
                  ? `${currentRole} at ${company}` 
                  : currentRole || company}
              </div>
            )}
            
            {location && (
              <div className="flex items-center text-foreground/80 font-medium">
                <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                {location}
              </div>
            )}
            
            {linkedinUrl && (
              <div className="flex items-center text-foreground/80 font-medium">
                <Link2 className="h-4 w-4 mr-2 text-primary/70" />
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-sm">
            <span className="font-medium text-foreground/80">{connectionCount}+ connections</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button className="gap-2 rounded-full px-6">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" className="rounded-full px-6">
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
