"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MenteeForm from "../../myComponents/MenteeForm";

const BecomeMentor: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [menteeData, setMenteeData] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("https://mentorher-backend.vercel.app/api/mentee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Submission failed");
        return;
      }
      toast.success("Application submitted", {
        description: "Thank you for applying to be a mentee!",
      });
      router.push("/mentee-dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchMenteeData() {
      try {
        const res = await fetch('https://mentorher-backend.vercel.app/api/auth/menteedata',  {credentials: "include"});
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setMenteeData(json.data);
          router.push('/mentee-dashboard');
        } else {
          router.push('/Become-mentee');
        }
      } catch (error) {
        console.error("Error fetching mentee data:", error);
        router.push('/Become-mentee');
      } finally {
        setLoading(false);
      }
    }
    fetchMenteeData();
  }, [router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="animate-pulse text-lg sm:text-2xl font-medium text-white">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Vibrant background elements - now fully visible */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[25rem] sm:w-[35rem] lg:w-[50rem] h-[25rem] sm:h-[35rem] lg:h-[50rem] bg-purple-400/20 rounded-full blur-3xl animate-float animation-delay-0"></div>
        <div className="absolute top-1/3 right-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-pink-400/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-[25rem] sm:w-[35rem] lg:w-[50rem] h-[25rem] sm:h-[35rem] lg:h-[50rem] bg-blue-400/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-2/3 left-1/2 w-[15rem] sm:w-[20rem] lg:w-[30rem] h-[15rem] sm:h-[20rem] lg:h-[30rem] bg-indigo-400/15 rounded-full blur-3xl animate-float animation-delay-6000"></div>
      </div>

      {/* Header with glass effect */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            className="gap-2 text-sm sm:text-lg hover:bg-white/20 text-black"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black text-center flex-1">Become a Mentee</h1>
          <div className="w-16 sm:w-24" />
        </div>
      </header>

      {/* Main Content - Centered with premium glass effect */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-black text-sm sm:text-lg font-medium mb-4 sm:mb-6 border border-white/30">
                Mentee Application
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-black leading-tight">
                Gain Expertise
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-black/90 max-w-2xl mx-auto leading-relaxed px-4">
               Get Guidance from Women in Tech.
              </p>
            </div>
            
            {/* Ultra glass form container */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] transition-all duration-500">
              <MenteeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
          50% { transform: translateY(0) translateX(20px) rotate(0deg); }
          75% { transform: translateY(10px) translateX(-10px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
    </div>
  );
};

export default BecomeMentor;