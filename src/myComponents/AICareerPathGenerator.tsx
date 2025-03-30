"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Typed interfaces for better type safety
interface Mentor {
  name: string;
  specialization: string;
  contact: string;
}

interface Seminar {
  name: string;
  date: string;
  location: string;
}

// More comprehensive and structured data
const SKILLS_OPTIONS = [
  "JavaScript", "React", "Node.js", "Python", 
  "AI/ML", "Cybersecurity", "Data Science", 
  "C++", "Rust", "TypeScript"
];

const TECH_OPTIONS = [
  "Blockchain", "Cloud Computing", "DevOps", 
  "Next.js", "NLP", "Big Data", 
  "Quantum Computing", "Edge AI", "Web3"
];

const MENTORS: Record<string, Mentor> = {
  "Blockchain": { 
    name: "John Doe", 
    specialization: "Ethereum & Smart Contracts", 
    contact: "john.doe@blockchain.tech" 
  },
  "Cloud Computing": { 
    name: "Jane Smith", 
    specialization: "AWS & Multi-Cloud Strategies", 
    contact: "jane.smith@cloudexpert.com" 
  },
  "DevOps": { 
    name: "Michael Lee", 
    specialization: "CI/CD & Infrastructure as Code", 
    contact: "michael.lee@devops.pro" 
  },
  "Next.js": { 
    name: "Chris Johnson", 
    specialization: "React Framework & Performance", 
    contact: "chris.johnson@nextjs.dev" 
  }
};

const SEMINARS: Record<string, Seminar> = {
  "Blockchain": { 
    name: "Blockchain Innovation Summit", 
    date: "2025-03-15", 
    location: "Online & San Francisco" 
  },
  "Cloud Computing": { 
    name: "AWS Cloud Transformation Bootcamp", 
    date: "2025-06-22", 
    location: "Hybrid" 
  }
};

const generateRecommendations = (skills: string[], tech: string): string => {
  const recommendationRules: Record<string, (skills: string[]) => string> = {
    "Blockchain": (skills) => 
      skills.includes("JavaScript") && skills.includes("Node.js")
        ? "Excellent blockchain development potential with JavaScript & Node.js skills!"
        : "Consider learning Solidity and blockchain fundamentals.",
    
    "Cloud Computing": (skills) => 
      skills.includes("Python") && skills.includes("Data Science")
        ? "Your data science background is perfect for cloud architecture!"
        : "Focus on cloud certification and infrastructure knowledge.",
    
    "DevOps": (skills) => 
      skills.includes("React") && skills.includes("Node.js")
        ? "Strong web development skills align perfectly with DevOps automation!"
        : "Learn containerization and CI/CD pipelines.",
    
    "Next.js": (skills) => 
      skills.includes("JavaScript") || skills.includes("React")
        ? "Next.js will elevate your web development capabilities!"
        : "Start with React before diving deep into Next.js.",
    
    "NLP": (skills) => 
      skills.includes("AI/ML") && skills.includes("Python")
        ? "You're well-positioned for advanced NLP research!"
        : "Focus on machine learning and Python libraries."
  };

  return recommendationRules[tech]?.(skills) || 
    "Explore emerging technologies and continuously upgrade your skills!";
};

const AICareerPathGenerator: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [careerPath, setCareerPath] = useState<{
    mentor: Mentor;
    seminar: Seminar;
    recommendation: string;
  } | null>(null);

  const handleSkillSelection = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleTechSelection = (tech: string) => {
    setSelectedTech(tech);
  };

  const generateCareerPath = () => {
    if (!selectedTech) {
      alert("Please select a technology to explore!");
      return;
    }

    const mentor = MENTORS[selectedTech] || { 
      name: "Mentor Not Found", 
      specialization: "General Tech Guidance",
      contact: "mentors@techpath.com"
    };

    const seminar = SEMINARS[selectedTech] || {
      name: "Tech Exploration Webinar",
      date: "2025-09-01",
      location: "Online"
    };

    setCareerPath({
      mentor,
      seminar,
      recommendation: generateRecommendations(selectedSkills, selectedTech)
    });
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-100 p-10"
    >
      <div className="w-full max-w-6xl mx-auto text-center p-12 bg-white rounded-3xl shadow-2xl border border-pink-300 transform transition-all hover:scale-105">
        <h2 className="text-6xl font-bold text-pink-600 mb-8 font-cursive drop-shadow-lg">
          AI Career Path Generator
        </h2>
        <p className="text-2xl text-gray-700 mb-12 font-light">
          Discover your personalized tech career journey
        </p>

        {/* Skills Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">
            Select Your Current Skills:
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {SKILLS_OPTIONS.map(skill => (
              <motion.button
                key={skill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-full text-md font-medium transition-all shadow-lg border-2 border-pink-400 ${
                  selectedSkills.includes(skill) 
                    ? "bg-pink-500 text-white" 
                    : "bg-white text-pink-600 hover:bg-pink-200"
                }`}
                onClick={() => handleSkillSelection(skill)}
              >
                {skill}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Technology Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">
            Choose a Technology to Learn:
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {TECH_OPTIONS.map(tech => (
              <motion.button
                key={tech}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-3 rounded-full text-md font-medium transition-all shadow-lg border-2 border-purple-400 ${
                  selectedTech === tech 
                    ? "bg-purple-500 text-white" 
                    : "bg-white text-purple-600 hover:bg-purple-200"
                }`}
                onClick={() => handleTechSelection(tech)}
              >
                {tech}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <Button 
            onClick={generateCareerPath} 
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-semibold rounded-full shadow-lg hover:scale-110 transition-all"
          >
            Generate Career Path
          </Button>
        </div>

        {/* Career Path Result */}
        {careerPath && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-8 bg-purple-300 text-purple-900 rounded-3xl text-center shadow-lg border border-purple-400"
          >
            <h3 className="text-2xl font-semibold">Your Tech Career Insights</h3>
            <div className="space-y-4 mt-4">
              <p className="text-lg">
                <strong>Mentor:</strong> {careerPath.mentor.name}
                <br />
                <span className="text-sm text-purple-700">
                  Specialization: {careerPath.mentor.specialization}
                </span>
              </p>
              <p className="text-lg">
                <strong>Recommended Seminar:</strong> {careerPath.seminar.name}
                <br />
                <span className="text-sm text-purple-700">
                  Date: {careerPath.seminar.date} | Location: {careerPath.seminar.location}
                </span>
              </p>
              <p className="text-lg font-bold text-pink-700">
                Career Recommendation: {careerPath.recommendation}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default AICareerPathGenerator;