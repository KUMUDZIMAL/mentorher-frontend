import type { SkillCategory } from "@/myComponents/profile-mentor/ProfileSkills";
import type { MentorshipInfo } from "@/myComponents/profile-mentor/ProfileMentorship";
import type { Experience } from "@/myComponents/profile-mentor/ProfileExperience";

export interface MentorProfileViewData {
  userId: string;
  fullName: string;
  profilePhoto?: string;
  currentRole?: string;
  company?: string;
  linkedinUrl?: string;
  personalBio?: string;
  experiences: Experience[];
  skillCategories: SkillCategory[];
  mentorship: MentorshipInfo;
  languages: string[];
  achievements: string[];
  mentorshipExperience?: string;
  education?: string;
  stats?: { menteeCount: number; completedSessions: number };
}

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/** Maps a raw Mentor2 document (from /api/mentors/[id]) to the profile view model. */
export function mapMentorToProfile(doc: any, stats?: { menteeCount: number; completedSessions: number }): MentorProfileViewData {
  const userId =
    doc?.userId && typeof doc.userId === "object" ? String(doc.userId._id) : String(doc?.userId ?? "");

  const experiences: Experience[] = (doc?.experience ?? []).map((exp: any, index: number) => ({
    id: String(exp._id ?? index),
    role: exp.role ?? "",
    company: exp.company ?? "",
    duration: exp.duration ?? "",
    description: exp.description,
    current: Boolean(exp.current),
  }));

  const categories: SkillCategory[] = [
    { name: "Skills", skills: doc?.technicalSkills ?? [] },
    { name: "Soft Skills", skills: doc?.softSkills ?? [] },
    { name: "Areas of Interest", skills: doc?.areasOfInterest ?? [] },
  ].filter((category) => category.skills.length > 0);

  const mentorship: MentorshipInfo = {
    style: doc?.mentoringStyle ?? "",
    goals: doc?.mentoringGoals ?? "",
    availability: doc?.availability ?? [],
    areasOfInterest: doc?.areasOfInterest ?? [],
    menteeCount: stats?.menteeCount ?? 0,
    isAcceptingMentees: true,
  };

  return {
    userId,
    fullName: doc?.fullName ?? "",
    profilePhoto: doc?.profilePhoto ?? "",
    currentRole: doc?.currentRole ?? "",
    company: doc?.company ?? "",
    linkedinUrl: doc?.linkedinUrl ?? "",
    personalBio: doc?.personalBio ?? "",
    experiences,
    skillCategories: categories,
    mentorship,
    languages: doc?.languages ?? [],
    achievements: doc?.achievements ? [doc.achievements] : [],
    mentorshipExperience: doc?.mentoringExperience ?? doc?.mentorshipExperience ?? "",
    education: doc?.education ?? "",
    stats,
  };
}
