// app/group-chat/GroupChatContent.tsx
"use client";
import { useSearchParams } from "next/navigation";
import ChatApp from "@/myComponents/ChatApp";

const GroupChatContent = () => {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-10">Group Chat</h1>
      {groupId ? (
        <ChatApp groupId={groupId} />
      ) : (
        <p>Please provide a groupId query parameter in the URL.</p>
      )}
    </div>
  );
};

export default GroupChatContent;
