"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export interface SkillCategory {
  name: string;
  skills: string[];
}

const ProfileSkills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from API and extract technicalSkills as one category.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/menteedata");
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Failed to load profile data");
          return;
        }

        const fetchedData = result.data;
        // Map the technicalSkills (array of strings) to a single SkillCategory.
        const skillsArray: SkillCategory[] = fetchedData.technicalSkills
          ? [{ name: "Technical Skills", skills: fetchedData.technicalSkills }]
          : [];
        setCategories(skillsArray);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {
    toast.success("Edit skills functionality coming soon!");
  };

  if (loading) return <div>Loading skills...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card className="mb-6 border-2 border-accent/30 overflow-hidden">
      <CardHeader className="pb-3 bg-accent/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary/70" />
            Skills & Expertise
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 p-2">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No skills listed yet.</p>
        ) : (
          <div className="space-y-6">
            {categories.map((category, index) => (
              <div key={category.name}>
                {index > 0 && <Separator className="my-5" />}
                <h3 className="font-medium text-lg mb-4">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSkills;
