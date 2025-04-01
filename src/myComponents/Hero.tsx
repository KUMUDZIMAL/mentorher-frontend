"use client";
import { useState,useEffect } from "react";
import React from "react";
import { ArrowRight, HeartHandshake, GraduationCap, Users, Shield, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
interface User {
  _id: string;
  // Add additional properties as needed.
}


const Hero = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://mentorher-backend.vercel.app/api/auth/user", { cache: "no-store", credentials: "include" });
        const data = await res.json();
        console.log("Fetched auth data:", data);

        // Check if the fetched data has an _id property.
        if (data && data._id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  const features = [
    {
      icon: <HeartHandshake className="w-10 h-10 text-pink-700" />,
      title: "Mentor Matching",
      description: "Find your perfect mentor based on shared interests and goals",
      color: "from-rose-100 to-pink-200",
      route: `/recommendations?userId=${user?._id}`
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-purple-700" />,
      title: "AI Career Path Generator",
      description: "Personalized learning paths for professional growth",
      color: "from-violet-100 to-purple-200",
      route: "/chatbot"
    },
    {
      icon: <Users className="w-10 h-10 text-teal-700" />,
      title: "Community Support",
      description: "Connect with like-minded women in your field",
      color: "from-teal-100 to-cyan-200",
      route: "/create-group"
    },
    {
      icon: <Shield className="w-10 h-10 text-indigo-700" />,
      title: "Safe Space",
      description: "A judgment-free environment for open discussions",
      color: "from-indigo-100 to-blue-200",
      route: "/forum"
    },
    {
      icon: <Sparkles className="w-10 h-10 text-amber-700" />,
      title: "Find a Mentor",
      description: "Guidance for promotions and career transitions",
      color: "from-amber-100 to-yellow-200",
      route: "/find-mentor"
    },
    {
      icon: <Globe className="w-10 h-10 text-emerald-700" />,
      title: "Become a Mentor",
      description: "Become a Mentor and Share Your Knowledge",
      color: "from-emerald-100 to-green-200",
      route: "/BecomeMentor"
    }
  ];
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center ">
      <div className="relative w-full max-w-[1600px] mx-auto px-6 py-24 flex flex-col">
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
                  <Link href={feature.route}>
                    <ArrowRight className="w-6 h-6 text-pink-600 mt-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
