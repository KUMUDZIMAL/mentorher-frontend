"use client";
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomId, setRoomId] = useState('');

  // Check authentication on mount.
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        const data = await res.json();
        // Adjust based on your API response structure
        if (data && data._id) {
          setUser(data);
          router.push("/room");
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // If not authenticated, return nothing (redirect is in progress).
    return null;
  }

  const handleClick = () => {
    if (roomId.trim()) {
      window.location.href = `/video-call/${roomId}`;
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  return (
    <div>
      <input
        placeholder="Enter Room ID"
        name="roomid"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button onClick={handleClick}>Join</Button>
    </div>
  );
};

export default Page;
