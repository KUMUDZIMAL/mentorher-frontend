"use client";

import React from "react";
import { ArrowRight, Users, BookOpen, MessageSquare, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Contact = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center py-16 sm:py-20">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-gradient-to-r from-blue-400 via-purple-300 to-pink-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="absolute top-1/3 left-1/4 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] bg-purple-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[250px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[350px] lg:h-[500px] bg-pink-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Glassmorphic Container */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Making an <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Impact</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
              MentorHer empowers women in tech to build meaningful careers through mentorship, community, and professional growth.
            </p>
          </div>

          {/* Stats Grid with Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {[
              { icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />, value: "2,000+", label: "Active Members" },
              { icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />, value: "500+", label: "Expert Mentors" },
              { icon: <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />, value: "10,000+", label: "Sessions Completed" },
              { icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />, value: "95%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-white/20 rounded-full">
                    {stat.icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
                  <p className="text-sm sm:text-base lg:text-xl text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-10">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                  className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base lg:text-lg italic text-gray-600 dark:text-gray-300 leading-relaxed">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-4 sm:mb-6 text-purple-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Ready to Transform Your Career?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
                Join thousands of women who have accelerated their careers through mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button asChild className="rounded-full text-base sm:text-lg py-6 sm:py-7 px-8 sm:px-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <Link href="/find-mentor">
                    <span className="flex items-center gap-2 sm:gap-3 font-semibold">
                      Find a Mentor
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full text-base sm:text-lg py-6 sm:py-7 px-8 sm:px-10 border-purple-600 text-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-800/10 transition-colors duration-300">
                  <Link href="/BecomeMentor">
                    <span className="flex items-center gap-2 sm:gap-3 font-medium">
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