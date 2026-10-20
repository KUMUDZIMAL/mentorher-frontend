// app/group-chat/page.tsx
"use client";
import { Suspense } from "react";
import GroupChatContent from "./GroupChatContent";
import Loader from "@/components/Loader";

const GroupChatPage = () => {
  return (
    <Suspense fallback={<Loader fullPage size="lg" label="Loading group chat..." />}>
      <GroupChatContent />
    </Suspense>
  );
};

export default GroupChatPage;
