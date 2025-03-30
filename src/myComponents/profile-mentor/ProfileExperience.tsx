

// Prevent model recompilation during hot reloads
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus, Building2, BriefcaseBusiness, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description?: string;
  current?: boolean;
}

interface ProfileExperienceProps {
  experiences: Experience[];
  isOwnProfile?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
}

const ProfileExperience = ({ 
  experiences, 
  isOwnProfile = false,
  onAdd,
  onEdit
}: ProfileExperienceProps) => {
  return (
    <Card className="mb-6 border-2 border-accent/30 overflow-hidden">
      <CardHeader className="pb-3 bg-accent/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary/70" />
            Experience
          </CardTitle>
          {isOwnProfile && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onAdd} className="h-8 p-2">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        {experiences.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No experience listed yet.</p>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {index > 0 && <Separator className="my-6" />}
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-xl">{exp.role}</h3>
                      <p className="text-base text-foreground/80 flex items-center mt-1">
                        {exp.company}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center">
                        <Clock className="inline h-3.5 w-3.5 mr-1.5" />
                        {exp.duration}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit && onEdit(exp.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-base mt-3 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileExperience;