"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Quote } from "lucide-react";
import { toast } from "sonner";

interface MenteeData {
  fullName: string;
  personalBio: string;
  // Add additional fields if needed...
}

const ProfileAbout: React.FC = () => {
  const [profile, setProfile] = useState<MenteeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from the API on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/menteedata");
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Failed to load profile data");
          return;
        }

        setProfile(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handler for edit button (modify as needed)
  const handleEdit = () => {
    // For example, open an edit modal or navigate to an edit page
    toast.success("Edit functionality coming soon!");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <Card className="mb-6 overflow-hidden border-2 border-accent/30">
      <CardHeader className="pb-3 bg-accent/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary/70" />
            About
          </CardTitle>
          {/* Show edit button if this is the logged in user's own profile */}
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="whitespace-pre-line text-lg leading-relaxed font-light">
          {profile.personalBio}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAbout;
