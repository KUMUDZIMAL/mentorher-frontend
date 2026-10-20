"use client";

import { useParams } from "next/navigation";
import MentorProfileContent from "@/myComponents/profile-mentor/MentorProfileContent";

/**
 * Public mentor profile — loads the specific mentor from MongoDB by id.
 * Handles loading, invalid id, not-found and error states.
 */
export default function MentorProfileByIdPage() {
  const { id } = useParams<{ id: string }>();
  return <MentorProfileContent mentorId={id} />;
}
