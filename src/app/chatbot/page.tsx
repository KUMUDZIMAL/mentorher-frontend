// pages/ChatbotPage.tsx
"use client";

import React, { useState, useRef, useEffect, FormEvent, ChangeEvent, ReactNode } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/myComponents/Navbar";

// --- Avatar ---
const Avatar = ({ initials, className }: { initials: string; className?: string }) => (
  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${className} bg-gray-300 flex items-center justify-center`}>
    <span className="font-bold text-white">{initials}</span>
  </div>
);

// --- Card & Subcomponents ---
const Card = ({ children }: { children: ReactNode }) => (
  <div className="
    w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl
    flex flex-col
    p-4 sm:p-6 md:p-8
    bg-white bg-opacity-60 backdrop-blur-md
    shadow-xl rounded-2xl
    h-[80vh] sm:h-[70vh]  /* give fixed height so scroll works */
  ">
    {children}
  </div>
);

const CardHeader = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap items-center space-x-3 border-b pb-2">
    {children}
  </div>
);

const CardTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-lg sm:text-xl font-semibold flex-1 break-words">
    {children}
  </h2>
);

const CardContent = ({ children }: { children: ReactNode }) => (
  <div className="flex-1 overflow-y-auto space-y-4 py-2">
    {children}
  </div>
);

const CardFooter = ({ children }: { children: ReactNode }) => (
  <div className="pt-2 border-t bg-white bg-opacity-80 backdrop-blur-md">
    {children}
  </div>
);

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // on form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", content: input }]);
    const prompt = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://mentorher-backend.vercel.app/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: prompt }),
      });
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let assistant: Message = { role: "assistant", content: "" };
      setMessages((m) => [...m, assistant]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = dec.decode(value);
          for (const line of chunk.split("\n\n")) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(5));
              assistant.content += data.content || "";
              setMessages((m) => [...m.slice(0, -1), { ...assistant }]);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 bg-[url('/bg-blur.png')] bg-cover">
        <Card>
          <CardHeader>
            <Avatar initials="AI" className="bg-violet-500" />
            <CardTitle>Your AI Career Path Generator</CardTitle>
          </CardHeader>

          <CardContent>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`
                  px-4 py-2 rounded-xl shadow
                  max-w-[80%] sm:max-w-[60%]
                  ${m.role === "user"
                    ? "bg-violet-500 text-white rounded-br-none"
                    : "bg-violet-200 bg-opacity-90 text-gray-800 rounded-bl-none"}
                `}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <Avatar initials="AI" className="bg-violet-500 mr-2" />
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow max-w-[60%]">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </CardContent>

          <CardFooter>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-full border-gray-300 focus:ring-2 focus:ring-violet-500"
              />
              <Button type="submit" disabled={loading} className="rounded-full bg-violet-500 hover:bg-violet-600 text-white p-2">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
