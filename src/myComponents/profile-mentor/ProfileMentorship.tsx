"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Clock, Calendar, Users, GraduationCap, Sparkle } from "lucide-react";

export interface MentorshipInfo {
  style: string;
  goals: string;
  availability: { day: string; startTime: string; endTime: string }[];
  areasOfInterest: string[];
  menteeCount?: number;
  isAcceptingMentees?: boolean;
}

interface ProfileMentorshipProps {
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const ProfileMentorship = ({ isOwnProfile = false, onEdit }: ProfileMentorshipProps) => {
  const [mentorship, setMentorship] = useState<MentorshipInfo | null>(null);
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
        // Map fetched mentor data to MentorshipInfo
        const fetchedMentorship: MentorshipInfo = {
          style: data.mentoringStyle || "",
          goals: data.mentoringGoals || "",
          availability: data.availability || [],
          areasOfInterest: data.areasOfInterest || [],
          // Optionally, set these fields based on your own logic or defaults
          menteeCount: 0,
          isAcceptingMentees: true,
        };
        setMentorship(fetchedMentorship);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  if (loading) {
    return <div>Loading mentorship...</div>;
  }

  if (!mentorship) {
    return <div>No mentorship data found</div>;
  }

  const { style, goals, availability, areasOfInterest, menteeCount = 0, isAcceptingMentees = true } = mentorship;

  return (
    <Card className="mb-6 border-2 border-accent/30 overflow-hidden">
      <CardHeader className="pb-3 bg-accent/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkle className="h-5 w-5 text-primary/70" />
            Mentorship
          </CardTitle>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 p-2">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-primary/70" />
            Mentoring Style
          </h3>
          <p className="text-lg font-light leading-relaxed">{getStyleDescription(style)}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-primary/70" />
            Mentoring Goals
          </h3>
          <p className="text-lg font-light leading-relaxed">{goals}</p>
        </div>
        
        {menteeCount > 0 && (
          <div className="text-sm font-medium text-foreground/80 bg-secondary/40 inline-block px-4 py-2 rounded-full">
            Currently mentoring {menteeCount} {menteeCount === 1 ? 'mentee' : 'mentees'}
          </div>
        )}
        
        <div>
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary/70" />
            Availability
          </h3>
          
          {availability.length > 0 ? (
            <div className="grid gap-3">
              {availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 text-base p-3 rounded-md bg-accent/5 border border-accent/20">
                  <Badge variant="outline" className="font-medium px-3 border-primary/30 bg-primary/5">
                    {slot.day || "N/A"}
                  </Badge>
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span className="font-light">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">No availability set.</p>
          )}
        </div>
        
        {areasOfInterest.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3">Areas of Mentorship</h3>
            <div className="flex flex-wrap gap-2">
              {areasOfInterest.map((area) => (
                <Badge 
                  key={area} 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary/90 border border-primary/20"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {!isOwnProfile && (
          <div className="mt-6 pt-4 border-t">
            <Button 
              className="w-full rounded-full py-6 text-lg font-medium" 
              disabled={!isAcceptingMentees}
            >
              {isAcceptingMentees 
                ? "Request Mentorship" 
                : "Not accepting new mentees"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper functions
function getStyleDescription(style: string): string {
  switch (style.toLowerCase()) {
    case 'structured':
      return 'Structured: Regular sessions with defined goals and milestones';
    case 'informal':
      return 'Informal: Flexible availability for questions and ad-hoc guidance';
    case 'hybrid':
      return 'Hybrid: Mix of structured sessions and informal support as needed';
    default:
      return style;
  }
}

function formatTime(time: string): string {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  } catch (error) {
    return time;
  }
}

export default ProfileMentorship;
