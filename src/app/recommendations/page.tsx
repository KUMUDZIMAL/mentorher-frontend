// app/recommendations/page.tsx
"use client";
import { Suspense } from "react";
import RecommendationsContent from "./RecommendationsContent";
import Loader from "@/components/Loader";

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<Loader fullPage size="lg" label="Loading recommendations..." />}>
      <RecommendationsContent />
    </Suspense>
  );
}
