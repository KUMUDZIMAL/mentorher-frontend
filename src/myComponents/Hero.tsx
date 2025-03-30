"use client";

import React from "react";
import { ArrowRight, HeartHandshake, GraduationCap, Users, Shield, Sparkles, Globe } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <HeartHandshake className="w-10 h-10 text-pink-700" />,
    title: "Mentor Matching",
    description: "Find your perfect mentor based on shared interests and goals",
    color: "from-rose-100 to-pink-200"
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-purple-700" />,
    title: "Skill Development",
    description: "Personalized learning paths for professional growth",
    color: "from-violet-100 to-purple-200"
  },
  {
    icon: <Users className="w-10 h-10 text-teal-700" />,
    title: "Community Support",
    description: "Connect with like-minded women in your field",
    color: "from-teal-100 to-cyan-200"
  },
  {
    icon: <Shield className="w-10 h-10 text-indigo-700" />,
    title: "Safe Space",
    description: "A judgment-free environment for open discussions",
    color: "from-indigo-100 to-blue-200"
  },
  {
    icon: <Sparkles className="w-10 h-10 text-amber-700" />,
    title: "Career Growth",
    description: "Guidance for promotions and career transitions",
    color: "from-amber-100 to-yellow-200"
  },
  {
    icon: <Globe className="w-10 h-10 text-emerald-700" />,
    title: "Global Network",
    description: "Connect with mentors worldwide",
    color: "from-emerald-100 to-green-200"
  }
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center ">
      {/* Soft Background Elements */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 left-10 w-96 h-96 rounded-full bg-pink-300 blur-3xl"></div>
        <div className="absolute bottom-16 right-10 w-96 h-96 rounded-full bg-purple-300 blur-3xl"></div>
      </div> */}

      {/* Main Content */}
      <div className="relative w-full max-w-[1600px] mx-auto px-6 py-24 flex flex-col">
        {/* Section Heading */}
        <div className="text-left md:text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Empower Your Journey
            </span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto mt-3">
            Where women leaders mentor the next generation of professionals.
          </p>
        </div>

        {/* Feature Cards - Left & Right Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-0">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative rounded-2xl p-6 h-[260px] transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${feature.color}`}
              style={{
                backdropFilter: 'blur(14px)',
                boxShadow: `
                  0 4px 30px rgba(0, 0, 0, 0.06),
                  inset 2px 2px 6px rgba(255, 255, 255, 0.7)
                `,
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"></div>
              
              <div className="relative flex flex-col items-start space-y-4">
                <div className={`p-4 rounded-xl bg-white/30 backdrop-blur-sm group-hover:bg-white/40 transition-colors duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-lg">
                  {feature.description}
                </p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button Removed as Requested */}
      </div>
    </section>
  );
};

export default Hero;
