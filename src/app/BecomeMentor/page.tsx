"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MentorForm from "../../myComponents/MentorForm";

const BecomeMentor: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data submitted:", data);
    toast.success("Application submitted", {
      description: "Thank you for applying to be a mentor!",
    });
    setIsSubmitting(false);
  };

  useEffect(() => {
    async function fetchMenteeData() {
      try {
        const res = await fetch('/api/auth/mentordata');
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setMentorData(json.data);
          router.push('/mentor-dashboard');
        } else {
          router.push('/BecomeMentor');
        }
      } catch (error) {
        console.error("Error fetching mentee data:", error);
        router.push('/BecomeMentor');
      } finally {
        setLoading(false);
      }
    }
    fetchMenteeData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/20 text-center">
          <div className="animate-pulse text-2xl font-medium text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background and header code omitted for brevity */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <div className="inline-block px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm text-black text-lg font-medium mb-6 border border-white/30">
                Mentor Application
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-4 text-black">
                Share Your Expertise
              </h1>
              <p className="text-xl text-black/90 max-w-2xl mx-auto leading-relaxed">
                Help shape the future of women in technology by becoming a mentor.
                Fill out the form below to begin your mentorship journey.
              </p>
            </div>
            {/* Ultra glass form container */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] transition-all duration-500">
              <MentorForm onSubmit={handleSubmit} isSSubmitting={isSubmitting} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Additional animation styles omitted for brevity */}
    </div>
  );
};

export default BecomeMentor;
