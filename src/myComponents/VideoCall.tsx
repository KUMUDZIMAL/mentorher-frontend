import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const RoomPage = () => {
  const { RoomId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const joinMeeting = async (element: HTMLDivElement) => {
      const AppId = 74206127;
      const ServerSecret = "20a0c3c047ae13bf7a606cd5fef59b3e";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        AppId,
        ServerSecret,
        RoomId!,
        "user",
        "kumud"
      );
      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Copy Link",
            url: `https://mentorher.vercel.app/video-call/${RoomId}`,
            scenario: {
              mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
          } as any, // Cast to any to allow extra properties like `scenario`
        ],
      });
    };

    if (containerRef.current && RoomId) {
      joinMeeting(containerRef.current);
    }
  }, [RoomId]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default RoomPage;
