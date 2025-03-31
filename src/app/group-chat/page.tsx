// app/group-chat/page.tsx
"use client";
import { Suspense } from "react";
import GroupChatContent from "./GroupChatContent";

const GroupChatPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupChatContent />
    </Suspense>
  );
};

export default GroupChatPage;
