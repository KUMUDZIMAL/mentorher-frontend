"use client";

import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setSubmitStatus('success');

      // Automatically reset after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('idle');
      console.error('Submission error', error);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6 animate-fade-in">
      <div className="flex items-center">
        <CheckCircle className="text-green-600 mr-4" size={36} />
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700">
            Thank you for reaching out to MentorHer. We'll review your message and get back to you soon.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Grid container: Left column for header/support, right column for form */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column: Connect with Us & Support Information */}
          <div className="flex-1 space-y-8">
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-black">
                Connect with       <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MentorHer
            </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 mt-4">
                We're here to support and empower women in their professional growth. Reach out and let's start a conversation.
              </p>
            </div>

            <div className="bg-white shadow-2xl rounded-2xl p-10 border-t-4 border-purple-600">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <MessageCircle className="text-purple-600 mr-4" size={36} />
                Our Support Channels
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Connect with Us?</h3>
                  <p className="text-gray-600">
                    At MentorHer, we're committed to providing personalized support, career guidance, and networking opportunities for women professionals.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="text-purple-600" size={24} />
                    <p className="text-purple-800 font-medium">
                      Support Hours
                    </p>
                  </div>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM to 6:00 PM EST
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    We aim to respond within 24 business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex-1">
            <div className="bg-white shadow-2xl rounded-2xl p-10 border-t-4 border-pink-600">
              {submitStatus === 'success' ? (
                <SuccessMessage />
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {[
                      { name: "name", label: "Full Name", type: "text", required: true },
                      { name: "email", label: "Email Address", type: "email", required: true },
                      { name: "phone", label: "Phone Number", type: "tel", required: false },
                      { name: "subject", label: "Subject", type: "text", required: true }
                    ].map(({ name, label, type, required }, index) => (
                      <div key={index}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                          {label} {required ? <span className="text-red-500">*</span> : "(Optional)"}
                        </label>
                        <input
                          type={type}
                          id={name}
                          name={name}
                          required={required}
                          value={formData[name as keyof typeof formData]}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
                        />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
                        placeholder="Share your thoughts, questions, or feedback..."
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={submitStatus === 'submitting'}
                        className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg text-base font-semibold text-white 
                          ${submitStatus === 'submitting' 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                          } 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105`}
                      >
                        {submitStatus === 'submitting' ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="mr-3" size={24} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
