"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, errorMessage } from "@/lib/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";

interface RequestSessionDialogProps {
  open: boolean;
  onClose: () => void;
  mentorUserId: string;
  mentorName: string;
  onSuccess: () => void;
}

/**
 * Real "request a session" form — writes a SessionRequest document to MongoDB.
 */
const RequestSessionDialog: React.FC<RequestSessionDialogProps> = ({
  open,
  onClose,
  mentorUserId,
  mentorName,
  onSuccess,
}) => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topic || !date || !time) {
      setError("Please fill in the topic, date and time.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/requests", {
        method: "POST",
        body: { mentorUserId, topic, date, time, message },
      });
      toast.success("Session requested", {
        description: `Your request was sent to ${mentorName}.`,
      });
      setTopic("");
      setDate("");
      setTime("");
      setMessage("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Request a Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Send a real mentorship request to <span className="font-semibold">{mentorName}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Career transition to product management"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to discuss?"
              className="min-h-[90px]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
            >
              {submitting ? <Loader size="sm" inline /> : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestSessionDialog;
