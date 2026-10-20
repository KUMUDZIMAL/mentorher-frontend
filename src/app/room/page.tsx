"use client";
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import Navbar from '@/myComponents/Navbar';
import Loader from '@/components/Loader';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const Page = () => {
  const { status } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomId, setRoomId] = useState('');

  // Check authentication on mount.
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await apiFetch<any>("/api/auth/user");
        if (data && data._id) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Redirect unauthenticated visitors to login (never during the auth check).
  useEffect(() => {
    if (!isLoading && status === "unauthenticated") {
      window.location.href = "/auth/login";
    }
  }, [isLoading, status]);

  if (isLoading || status === "loading") {
    return <Loader fullPage size="lg" label="Checking authentication..." />;
  }

  if (!user) {
    // If not authenticated, return nothing (redirect is in progress).
    return null;
  }

  const handleClick = () => {
    if (roomId.trim()) {
      // Updated to use a query parameter instead of a dynamic segment.
      window.location.href = `/video-call?roomId=${roomId}`;
    } else {
      alert("Please enter a valid Room ID");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Navbar></Navbar>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          Join a Video Call
        </h2>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-purple-600"
          placeholder="Enter Room ID"
          name="roomid"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={handleClick}>
          Join
        </Button>
      </div>
    </div>
  );
};

export default Page;
