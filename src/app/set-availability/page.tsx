"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const router = useRouter();
  // We'll hold an array of availability entries.
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  // To handle new entry inputs
  const [newEntry, setNewEntry] = useState<AvailabilityEntry>({
    day: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleNewEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addEntry = () => {
    if (newEntry.day && newEntry.startTime && newEntry.endTime) {
      // Optionally check for duplicates
      setAvailability((prev) => [...prev, newEntry]);
      // Reset newEntry fields
      setNewEntry({ day: "", startTime: "", endTime: "" });
    } else {
      alert("Please fill in all fields for this entry.");
    }
  };

  const removeEntry = (index: number) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availability.length === 0) {
      alert("Please add at least one availability entry.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://mentorher-backend.vercel.app/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // In a real app, userId is retrieved from the token on the backend.
        body: JSON.stringify({ availability }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Availability updated successfully!");
        // Optionally redirect or update local state
        router.push("/mentor-dashboard");
      } else {
        setMessage(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl"></div>
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-4">Set Your Availability</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white/80 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block font-medium mb-2">Add Availability Entry</label>
          <div className="flex flex-col gap-3">
            <select
              name="day"
              value={newEntry.day}
              onChange={handleNewEntryChange}
              className="border p-2 rounded"
              required
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
              required
            />
            <Input
              type="time"
              name="endTime"
              value={newEntry.endTime}
              onChange={handleNewEntryChange}
              placeholder="End Time"
              required
            />
            <Button type="button" onClick={addEntry} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
              Add Entry
            </Button>
          </div>
        </div>

        {/* Show list of added entries */}
        {availability.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Your Availability</h2>
            <ul className="space-y-2">
              {availability.map((entry, index) => (
                <li key={index} className="flex justify-between border p-2 rounded">
                  <span>
                    {entry.day}: {entry.startTime} - {entry.endTime}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => removeEntry(index)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
          {loading ? "Saving..." : "Save Availability"}
        </Button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
    </div>
  );
}
