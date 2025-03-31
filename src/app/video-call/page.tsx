// app/video-call/page.tsx
"use client";
import { Suspense } from "react";
import RoomContent from "./RoomContent";

export default function VideoCallPage() {
  return (
    <Suspense fallback={<div>Loading video call...</div>}>
      <RoomContent />
    </Suspense>
  );
}
