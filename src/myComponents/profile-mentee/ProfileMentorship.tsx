"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Sparkles, GraduationCap, Users, Clock } from "lucide-react";
import { toast } from "sonner";

export interface MentorshipInfo {
  careerGoals: string;
  mentorshipGoals: string;
  challenges: string;
}

const ProfileMentorship: React.FC = () => {
  const [mentorship, setMentorship] = useState<MentorshipInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const res = await fetch("/api/auth/menteedata");
        if (!res.ok) {
          throw new Error("Failed to load profile data");
        }
        const result = await res.json();
        const fetchedData = result.data;

        const mentorshipData: MentorshipInfo = {
          careerGoals: fetchedData.careerGoals || "",
          mentorshipGoals: fetchedData.mentorshipGoals || "",
          challenges: fetchedData.challenges || "",
        };

        setMentorship(mentorshipData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenteeData();
  }, []);

  const handleEdit = () => {
    toast.success("Edit mentorship functionality coming soon!");
  };

  if (loading) {
    return <div>Loading mentorship info...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!mentorship) {
    return <div>No mentorship information available.</div>;
  }

  const { careerGoals, mentorshipGoals, challenges } = mentorship;

  return (
    <Card className="mb-6 border-2 border-accent/30 overflow-hidden">
      <CardHeader className="pb-3 bg-accent/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary/70" />
            Mentorship
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 p-2">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-primary/70" />
            Career Goals
          </h3>
          <p className="text-lg font-light leading-relaxed">{careerGoals}</p>
        </div>

        <div>
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary/70" />
            Mentoring Goals
          </h3>
          <p className="text-lg font-light leading-relaxed">{mentorshipGoals}</p>
        </div>

        {challenges && (
          <div>
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary/70" />
              Challenges
            </h3>
            <p className="text-lg font-light leading-relaxed">{challenges}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileMentorship;
