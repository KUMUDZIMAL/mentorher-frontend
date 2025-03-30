"use client";

import React, { useState } from "react";
// Import the EventType as a type-only import from EventsCalendar
import type { EventType } from "./EventsCalendar";

// Define the props for RegistrationModal using the correct event type
export interface RegistrationModalProps {
  event: EventType;
  onClose: () => void;
  onRegister: (formData: any) => void;
}

function RegistrationModal({ event, onClose, onRegister }: RegistrationModalProps) {
  // Pre-fill title, date, time from the selected event
  const [formData, setFormData] = useState({
    title: event.title || "",
    date: event.date || "",
    time: event.time || "",
    fullName: "",
    email: "",
    phone: "",
    isMentor: "", // "yes" or "no"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation for all fields
    if (formData.fullName && formData.email && formData.phone && formData.isMentor) {
      try {
        const response = await fetch("/api/registerEvent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // In a real application, userId would be retrieved from the authenticated user or token
            userId: "dummyUserId",
            eventId: event.id,
            ...formData,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          setSubmitted(true);
          onRegister(formData);
        } else {
          alert(data.error || "Registration failed");
        }
      } catch (error) {
        console.error(error);
        alert("Registration failed");
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-2xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Register for {event.title}</h2>
        {submitted ? (
          <div className="text-green-600 text-lg">Registered Successfully!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Pre-filled fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                readOnly
              />
            </div>

            {/* User-input fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Are you a mentor?</label>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="isMentor"
                    value="yes"
                    onChange={handleChange}
                    checked={formData.isMentor === "yes"}
                    className="mr-1"
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="isMentor"
                    value="no"
                    onChange={handleChange}
                    checked={formData.isMentor === "no"}
                    className="mr-1"
                    required
                  />
                  No
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegistrationModal;
