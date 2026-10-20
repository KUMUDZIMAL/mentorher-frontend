"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch, ApiError, errorMessage } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [denied, setDenied] = useState<null | "login" | "not-mentor">(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    category: "Webinar",
    isVirtual: true,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<{ success: boolean }>("/api/auth/mentordata");
        if (!cancelled && res.success) setChecking(false);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) setDenied("login");
        else if (err instanceof ApiError && err.status === 404) setDenied("not-mentor");
        else setError(errorMessage(err));
        setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.date.trim() || !form.time.trim()) {
      setError("Title, date and time are required.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/events", { method: "POST", body: form });
      router.push("/#events");
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" label="Checking mentor access..." />
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <AlertTriangle size={40} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-3">
          {denied === "login" ? "Please log in first" : "Mentors only"}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {denied === "login"
            ? "You need to be logged in to create an event."
            : "Only mentors can create events on MentorHer."}
        </p>
        <Link href={denied === "login" ? "/auth/login" : "/BecomeMentor"}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {denied === "login" ? "Go to Login" : "Become a Mentor"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative py-10 px-4">
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-xl mx-auto relative">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
            <Calendar size={14} /> Mentor Events
          </span>
          <h1 className="text-3xl font-bold">Create an Event</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Publish a webinar or workshop — platform members can register for it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Resume Building Workshop"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time *</label>
              <Input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Online / Room 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded text-sm bg-white"
              >
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="Networking">Networking</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="What is this event about?"
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isVirtual"
              checked={form.isVirtual}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isVirtual: e.target.checked }))
              }
            />
            This is a virtual event
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white"
            >
              {submitting ? "Creating..." : "Create Event"}
            </Button>
          </div>

          {user && (
            <p className="text-xs text-muted-foreground text-center">
              Creating as {user.username}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
