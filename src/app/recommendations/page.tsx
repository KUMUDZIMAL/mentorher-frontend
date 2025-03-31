// app/recommendations/page.tsx
"use client";
import { Suspense } from "react";
import RecommendationsContent from "./RecommendationsContent";

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div>Loading recommendations...</div>}>
      <RecommendationsContent />
    </Suspense>
  );
}
