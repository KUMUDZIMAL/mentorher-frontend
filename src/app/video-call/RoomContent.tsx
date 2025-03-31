// app/video-call/RoomContent.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const RoomContent: React.FC = () => {
  // Get the roomId from the query string
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") ?? "";
  
  const [userId, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const meetingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  console.log("RoomId from query:", roomId);

  // Fetch user profile on mount.
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://mentorher-backend.vercel.app/api/auth/user", { credentials: "include" });
        const data = await response.json();
        console.log("User data fetched:", data);
        if (data && data._id) {
          setUserId(data._id);
          // Use fallback if username is not provided.
          const fetchedUsername = data.username || data.userName || "TestUser";
          console.log("Using username:", fetchedUsername);
          setUserName(fetchedUsername);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        router.push("/auth/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  // Initialize the meeting once dependencies are ready.
  useEffect(() => {
    console.log("Checking initialization:", { roomId, userId, username, container: meetingRef.current });
    if (roomId && userId && username && meetingRef.current) {
      const initMeeting = async (element: HTMLDivElement) => {
        try {
          console.log("Initializing meeting with:", { roomId, userId, username });
          const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
          console.log("ZegoUIKitPrebuilt loaded:", ZegoUIKitPrebuilt);
          const AppId = 1197900896;
          const ServerSecret = "5253cb2f01287a8115e723d4b96706c6";

          // Generate the kit token.
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(AppId, ServerSecret, roomId, userId, username);
          console.log("Generated kit token:", kitToken);

          const zc = ZegoUIKitPrebuilt.create(kitToken);
          zc.joinRoom({
            container: element,
            sharedLinks: [
              {
                name: "Copy Link",
                url: `https://mentorher.vercel.app/video-call?roomId=${roomId}`,
                scenario: {
                  mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
              } as any,
            ],
          });
          console.log("Meeting initialized");
        } catch (err) {
          console.error("Error initializing meeting:", err);
        }
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

export default RoomContent;
