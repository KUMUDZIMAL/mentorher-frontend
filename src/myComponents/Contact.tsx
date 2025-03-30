"use client";

import React from "react";
import { ArrowRight, Users, BookOpen, MessageSquare, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Contact = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400 via-purple-300 to-pink-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Glassmorphic Container */}
      <div className="relative w-full max-w-7xl mx-auto px-8 py-16">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Making an <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Impact</span>
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              MentorConnective empowers women in tech to build meaningful careers through mentorship, community, and professional growth.
            </p>
          </div>

          {/* Stats Grid with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: <Users className="w-10 h-10" />, value: "2,000+", label: "Active Members" },
              { icon: <BookOpen className="w-10 h-10" />, value: "500+", label: "Expert Mentors" },
              { icon: <MessageSquare className="w-10 h-10" />, value: "10,000+", label: "Sessions Completed" },
              { icon: <Star className="w-10 h-10" />, value: "95%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "MentorConnective helped me land my dream job at a FAANG company within 6 months!",
                  name: "Sarah K.",
                  role: "Software Engineer"
                },
                {
                  quote: "The community support gave me the confidence to ask for the promotion I deserved.",
                  name: "Priya M.",
                  role: "Product Manager"
                },
                {
                  quote: "As a mentor, I've found the experience incredibly rewarding and fulfilling.",
                  name: "Dr. Elena T.",
                  role: "Senior Data Scientist"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <p className="text-lg italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <Award className="w-12 h-12 mx-auto mb-6 text-purple-500" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of women who have accelerated their careers through mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild className="rounded-full text-lg py-7 px-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <Link href="/scheduler">
                    <span className="flex items-center gap-3 font-semibold">
                      Find a Mentor
                      <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full text-lg py-7 px-10 border-purple-600 text-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-800/10 transition-colors duration-300">
                  <Link href="/become-mentor">
                    <span className="flex items-center gap-3 font-medium">
                      Become a Mentor
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;