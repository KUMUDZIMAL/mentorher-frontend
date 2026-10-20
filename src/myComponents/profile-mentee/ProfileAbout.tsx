"use client";
import { API_BASE } from "@/lib/api";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Quote, AlertTriangle } from "lucide-react";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
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
        const res = await fetch(`${API_BASE}/api/auth/menteedata`,{  credentials: "include",});
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

  if (loading) return <Loader size="lg" label="Loading about..." />;
  if (error) return <EmptyState icon={AlertTriangle} title="Could not load about section" description={error} />;
  if (!profile) return <EmptyState title="No bio yet" description="Add a bio so others can get to know you." />;

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
