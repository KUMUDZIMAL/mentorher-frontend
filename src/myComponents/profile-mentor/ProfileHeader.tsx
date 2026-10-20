"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, MessageCircle, BriefcaseBusiness, Link2 } from "lucide-react";

interface MentorHeaderData {
  userId?: string;
  fullName?: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  linkedinUrl?: string;
}

interface ProfileHeaderProps {
  mentor: MentorHeaderData;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
}

const ProfileHeader = ({ mentor, isOwnProfile = false, onEdit, onMessage }: ProfileHeaderProps) => {
  const fullName = mentor.fullName || "Mentor";
  const initials = fullName
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
            {mentor.profilePhoto ? (
              <AvatarImage src={mentor.profilePhoto} alt={fullName} />
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
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}

        {/* Profile Info */}
        <div className="mt-20">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{fullName}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm">
            {(mentor.currentRole || mentor.company) && (
              <div className="flex items-center text-foreground/80 font-medium">
                <BriefcaseBusiness className="h-4 w-4 mr-2 text-primary/70" />
                {mentor.currentRole && mentor.company
                  ? `${mentor.currentRole} at ${mentor.company}`
                  : mentor.currentRole || mentor.company}
              </div>
            )}

            {mentor.linkedinUrl && (
              <div className="flex items-center text-foreground/80 font-medium">
                <Link2 className="h-4 w-4 mr-2 text-primary/70" />
                <a
                  href={mentor.linkedinUrl}
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
                <Button className="gap-2 rounded-full px-6" onClick={onMessage}>
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-full px-6" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
