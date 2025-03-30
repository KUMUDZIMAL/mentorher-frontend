"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

const RoomPage: React.FC = () => {
  const { RoomId } = useParams();
  // Convert RoomId to a string, defaulting to an empty string if undefined
  const roomId: string = Array.isArray(RoomId) ? RoomId[0] : RoomId ?? "";
  
  const [userId, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const meetingRef = useRef<HTMLDivElement>(null);

  console.log("RoomId from params:", roomId);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        console.log("User data fetched:", data);
        setUserId(data._id);
        // Use fallback if username not provided
        const fetchedUsername = data.username || data.userName || "TestUser";
        console.log("Using username:", fetchedUsername);
        setUserName(fetchedUsername);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Initialize the meeting once dependencies are ready.
  useEffect(() => {
    console.log("Checking initialization dependencies:", {
      roomId,
      userId,
      username,
      container: meetingRef.current,
    });
    if (roomId && userId && username && meetingRef.current) {
      const initMeeting = async (element: HTMLDivElement) => {
        console.log(
          "Initializing meeting with RoomId:",
          roomId,
          "userId:",
          userId,
          "username:",
          username
        );
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        console.log("ZegoUIKitPrebuilt loaded:", ZegoUIKitPrebuilt);
        const AppId = 1197900896;
        const ServerSecret = "5253cb2f01287a8115e723d4b96706c6";
        
        // Log parameters before token generation for debugging.
        console.log("Generating kit token with parameters:", {
          AppId,
          ServerSecret,
          roomId,
          userId,
          username,
        });
        
        if (!username) {
          console.error("Username is empty! Cannot generate kit token.");
          return;
        }
        
        // Generate the kit token.
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          AppId,
          ServerSecret,
          roomId,
          userId,
          username
        );
        console.log("Generated kit token:", kitToken);
        
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zc.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Copy Link",
              url: `https://localhost:3000/video-call/${roomId}`,
              scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
              },
            } as any,
          ],
        });
        console.log("Meeting initialized");
      };

      initMeeting(meetingRef.current);
    } else {
      console.log("Meeting initialization pending missing parameters");
    }
  }, [roomId, userId, username]);

  return (
    <div>
      <div ref={meetingRef} style={{ width: "100%", border: "2px solid red" }} />
    </div>
  );
};

export default RoomPage;
