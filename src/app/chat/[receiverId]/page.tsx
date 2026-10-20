"use client";
import React, { useEffect, useState } from "react";
import ChatApp from "@/myComponents/ChatApp";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";

const ChatPage: React.FC = () => {
  const params = useParams();
  let receiverId = params.receiverId;
  if (Array.isArray(receiverId)) {
    receiverId = receiverId[0];
  }

  const [receiverName, setReceiverName] = useState<string>("");

  useEffect(() => {
    if (!receiverId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const match = (data.users ?? []).find(
          (u: { _id: string }) => u._id === receiverId
        );
        if (match) setReceiverName(match.username);
      } catch {
        // header falls back to generic title
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [receiverId]);

  if (!receiverId) {
    return <Loader size="lg" label="Loading chat..." />;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {receiverName ? `Chat with ${receiverName}` : "Messages"}
        </h1>
        <Link href="/messages">
          <Button variant="outline" size="sm">
            All People
          </Button>
        </Link>
      </div>
      <ChatApp receiverId={receiverId} />
    </div>
  );
};

export default ChatPage;
