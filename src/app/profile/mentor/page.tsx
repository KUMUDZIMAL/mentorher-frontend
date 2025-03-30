"use client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/myComponents/Navbar";
import ProfileHeader from "@/myComponents/profile-mentor/ProfileHeader";
import ProfileAbout from "@/myComponents/profile-mentor/ProfileAbout";
import ProfileExperience from "@/myComponents/profile-mentor/ProfileExperience";
import ProfileSkills, { SkillCategory } from "@/myComponents/profile-mentor/ProfileSkills";
import ProfileMentorship from "@/myComponents/profile-mentor/ProfileMentorship";
import ProfileSidebar from "@/myComponents/profile-mentor/ProfileSidebar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Mock data for demo purposes
// In a real app, you'd fetch this data from your API
const mockMentorData = {
  id: "1",
  fullName: "Sarah Johnson",
  profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
  currentRole: "Senior Software Engineer",
  company: "TechWomen Inc.",
  location: "San Francisco, CA",
  connectionCount: 384,
  headline: "Passionate about empowering women in tech | Full-Stack Developer | Mentor",
  linkedinUrl: "https://linkedin.com/in/sarahjohnson",
  verified: true,
  about: "With over 8 years of experience in software development, I specialize in building scalable web applications using React, Node.js, and AWS. I'm passionate about mentoring junior developers, particularly women entering the tech field.\n\nI've helped more than 20 women transition into tech careers and navigate workplace challenges. My mentoring approach focuses on practical skills development, confidence building, and creating supportive networks.",
  experiences: [
    {
      id: "exp1",
      role: "Senior Software Engineer",
      company: "TechWomen Inc.",
      duration: "Jan 2020 - Present",
      description: "Leading the frontend development team for multiple client projects, specializing in React, TypeScript, and GraphQL.",
      current: true
    },
    {
      id: "exp2",
      role: "Software Engineer",
      company: "CodeCraft Solutions",
      duration: "Jul 2016 - Dec 2019",
      description: "Developed and maintained web applications using React, Node.js, and MongoDB."
    },
    {
      id: "exp3",
      role: "Junior Developer",
      company: "WebSolutions Ltd.",
      duration: "Mar 2014 - Jun 2016",
      description: "Started as an intern and grew into a full-time role working on frontend development with JavaScript and jQuery."
    }
  ],
  skillCategories: [
    {
      name: "Technical Skills",
      skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL", "AWS", "MongoDB", "Git", "REST APIs", "CSS/SCSS"]
    },
    {
      name: "Soft Skills",
      skills: ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Public Speaking", "Mentoring"]
    }
  ],
  mentorship: {
    style: "hybrid",
    goals: "I aim to help women gain confidence in their technical abilities and navigate career growth in the tech industry. My focus is on practical skills development and creating a supportive environment for learning.",
    availability: [
      { day: "Monday", startTime: "18:00", endTime: "20:00" },
      { day: "Wednesday", startTime: "18:00", endTime: "20:00" },
      { day: "Saturday", startTime: "10:00", endTime: "12:00" }
    ],
    areasOfInterest: ["Web Development", "Career Transitions", "Technical Interview Prep", "Leadership Skills"],
    menteeCount: 3,
    isAcceptingMentees: true
  },
  languages: ["English", "Spanish", "French"],
  achievements: [
    "Women in Tech Mentor of the Year 2022",
    "Published 'Navigating Tech as a Woman' blog series",
    "Speaker at Grace Hopper Conference 2021"
  ],
  mentorshipExperience: "Formal mentoring experience through Women Who Code and internal company programs since 2018.",
  education: "BS Computer Science, Stanford University",
  profileViewCount: 231
};

// In real application, get this from authentication state
const isLoggedInUser = true;
const mockCurrentUser = isLoggedInUser ? {
  id: "2",
  fullName: "Emma Watson",
  profilePhoto: "https://randomuser.me/api/portraits/women/22.jpg"
} : null;

const MentorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [mentor, setMentor] = useState(mockMentorData);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(id === "1"); // For demo purposes
  const { toast } = useToast();
  
  // In a real app, fetch the mentor data based on the id
  useEffect(() => {
    // This would be a real API call
    // setLoading(true);
    // api.getMentorProfile(id).then(data => {
    //   setMentor(data);
    //   setIsOwnProfile(currentUser?.id === data.id);
    //   setLoading(false);
    // }).catch(error => {
    //   toast({
    //     title: "Error loading profile",
    //     description: error.message,
    //     variant: "destructive"
    //   });
    //   setLoading(false);
    // });
  }, [id]);
  
  const handleEditClick = (section: string) => {
    toast({
      title: `Edit ${section}`,
      description: "This functionality will be implemented in a future update.",
    });
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background/40">
      <Navbar  />
      
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfileHeader 
              mentor={mentor} 
              isOwnProfile={isOwnProfile} 
            />
            
            <ProfileAbout 
           
            />
            
            <ProfileExperience 
              experiences={mentor.experiences}
              isOwnProfile={isOwnProfile}
              onAdd={() => handleEditClick("Experience")}
              onEdit={(id) => handleEditClick(`Experience ${id}`)}
            />
            
            <ProfileSkills 
        
            />
            
            <ProfileMentorship 
       
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileSidebar 
     
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t mt-20 bg-accent/5">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2023 Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorProfile;
