"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { apiFetch, ApiError, errorMessage } from "@/lib/api";

type AvailabilityEntry = {
  day: string;
  startTime: string;
  endTime: string;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SetAvailability() {
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [newEntry, setNewEntry] = useState<AvailabilityEntry>({
    day: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState<null | "login" | "mentor">(null);

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{ availability?: AvailabilityEntry[] }>(
        "/api/availability"
      );
      setAvailability(res.availability ?? []);
      setAccessDenied(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAccessDenied("login");
      } else if (err instanceof ApiError && err.status === 404) {
        setAccessDenied("mentor");
      } else {
        setError(errorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const handleNewEntryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const removeEntry = async (index: number) => {
    const next = availability.filter((_, i) => i !== index);
    setAvailability(next);
    // Persist the removal right away so slots don't come back on reload
    setError("");
    setMessage("");
    try {
      await apiFetch("/api/availability", {
        method: "POST",
        body: { availability: next },
      });
      setMessage("Availability saved!");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  // Single action: adds the typed entry (if any) and saves everything
  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setMessage("");

    const hasAnyField = newEntry.day || newEntry.startTime || newEntry.endTime;
    const hasAllFields = newEntry.day && newEntry.startTime && newEntry.endTime;

    if (hasAnyField && !hasAllFields) {
      setError("Please fill in day, start time and end time.");
      return;
    }
    if (hasAllFields && newEntry.startTime >= newEntry.endTime) {
      setError("End time must be after start time.");
      return;
    }

    const next = hasAllFields ? [...availability, newEntry] : availability;
    if (next.length === 0) {
      setError("Please add at least one availability entry.");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch<{ availability?: AvailabilityEntry[] }>(
        "/api/availability",
        { method: "POST", body: { availability: next } }
      );
      setAvailability(res.availability ?? next);
      setNewEntry({ day: "", startTime: "", endTime: "" });
      setMessage("Availability saved!");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" label="Loading your availability..." />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-3">
          {accessDenied === "login"
            ? "Please log in first"
            : "Availability is for mentors"}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {accessDenied === "login"
            ? "You need to be logged in to manage your availability."
            : "You need an approved mentor profile to set your availability slots."}
        </p>
        <Link href={accessDenied === "login" ? "/auth/login" : "/BecomeMentor"}>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {accessDenied === "login" ? "Go to Login" : "Become a Mentor"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
      <div className="min-h-screen bg-background flex flex-col items-center py-8 relative">
        <h1 className="text-3xl font-bold mb-2">Set Your Availability</h1>
        <p className="text-muted-foreground mb-6">
          Mentees can book sessions only inside these slots.
        </p>
        <form
          onSubmit={handleSave}
          className="w-full max-w-lg bg-white/80 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block font-medium mb-2">Add Availability Entry</label>
            <div className="flex flex-col gap-3">
              <select
                name="day"
                value={newEntry.day}
                onChange={handleNewEntryChange}
                className="border p-2 rounded"
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                name="startTime"
                value={newEntry.startTime}
                onChange={handleNewEntryChange}
                placeholder="Start Time"
              />
              <Input
                type="time"
                name="endTime"
                value={newEntry.endTime}
                onChange={handleNewEntryChange}
                placeholder="End Time"
              />
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                {saving ? "Saving..." : "Save Availability"}
              </Button>
            </div>
          </div>

          {availability.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">
                Your Availability ({availability.length}{" "}
                {availability.length === 1 ? "slot" : "slots"})
              </h2>
              <ul className="space-y-2">
                {availability.map((entry, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border p-2 rounded bg-white"
                  >
                    <span>
                      {entry.day}: {entry.startTime} - {entry.endTime}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => removeEntry(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
