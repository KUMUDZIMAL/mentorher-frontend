"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, AlertTriangle, Search } from "lucide-react";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError, errorMessage } from "@/lib/api";

type Person = {
  _id: string;
  username: string;
};

export default function MessagesPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [denied, setDenied] = useState(false);
  const [query, setQuery] = useState("");

  const loadPeople = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{ users?: Person[] }>("/api/users");
      setPeople(res.users ?? []);
      setDenied(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setDenied(true);
      else setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  const filtered = people.filter((p) =>
    p.username.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (denied) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-3">Please log in first</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to message people.
        </p>
        <Link href="/auth/login">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative py-10 px-4">
      <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
            <MessageSquare size={14} /> Direct Messages
          </span>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Pick anyone on the platform and start a conversation.
          </p>
        </div>

        {!loading && !denied && !error && people.length > 0 && (
          <div className="relative mb-5">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people..."
              className="w-full pl-9 pr-3 py-2.5 border rounded-lg bg-white/80 text-sm"
            />
          </div>
        )}

        {loading && <Loader size="lg" label="Loading people..." />}

        {!loading && error && (
          <EmptyState
            icon={AlertTriangle}
            title="Could not load people"
            description={error}
            action={
              <Button
                onClick={loadPeople}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && people.length === 0 && (
          <EmptyState
            title="No other users yet"
            description="Once more people join MentorHer, they will show up here."
          />
        )}

        {!loading && !error && people.length > 0 && filtered.length === 0 && (
          <EmptyState
            title="No matches"
            description={`No one matches "${query}".`}
          />
        )}

        {!loading &&
          !error &&
          filtered.map((person) => (
            <div
              key={person._id}
              className="flex items-center justify-between p-3 mb-3 border rounded-lg bg-white/80 backdrop-blur-md hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                  {(person.username || "M").charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">{person.username}</p>
              </div>
              <Link href={`/chat/${person._id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#53E0BC] text-[#10A881] hover:bg-[#E8FFF7] hover:text-[#1BCA9B] transition-all duration-300"
                >
                  <MessageSquare size={14} className="mr-1.5" />
                  Message
                </Button>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
