"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from '../../myComponents/mentee-dashboard/Navigation';
import StatsCard from '../../myComponents/mentee-dashboard/StatsCard';
import SessionCard from '../../myComponents/mentee-dashboard/SessionsCard';
import MentorCard from '../../myComponents/mentee-dashboard/MentorCard';
import MessageCard from '../../myComponents/mentee-dashboard/MessageCard';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, Clock, Star, 
  BookOpen, Search, Bell, Calendar as CalendarIcon 
} from 'lucide-react';
import Navbar from '@/myComponents/Navbar';

const MenteeDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [menteeData, setMenteeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    async function fetchMenteeData() {
      try {
        const res = await fetch('/api/auth/menteedata');
        const json = await res.json();
        if (json.success && json.data) {
          setMenteeData(json.data);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
      {/* Subtle floating elements */}
      <motion.div 
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />
      <motion.div 
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />

      <Navbar/>
      
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mentee Dashboard</h1>
              <p className="text-gray-600">Track your mentorship journey and upcoming sessions</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full md:w-auto">
                <Button className="w-full bg-white text-gray-800 border hover:bg-gray-50 backdrop-blur-sm" onClick={() => router.push("/find-mentor")}>
                  Find Mentors
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full md:w-auto">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white backdrop-blur-sm" onClick={() => router.push("/profile/mentee")}>
                View Public Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "My Mentors", value: 3, iconColor: "text-purple-500" },
            { icon: CalendarIcon, label: "Upcoming Sessions", value: 2, iconColor: "text-blue-500" },
            { icon: Clock, label: "Hours of Mentorship", value: 12, iconColor: "text-pink-500" },
            { icon: BookOpen, label: "Learning Paths", value: 4, iconColor: "text-teal-500" }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StatsCard 
                icon={stat.icon} 
                label={stat.label} 
                value={stat.value} 
                iconColor={stat.iconColor}
               
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Main Content */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sessions and Mentors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sessions Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Sessions</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 backdrop-blur-sm">
                    View All
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex border-b border-gray-200 mb-6">
                {['upcoming', 'past', 'requested'].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'upcoming' ? 'Upcoming' : tab === 'past' ? 'Past Sessions' : 'Requested'}
                  </motion.button>
                ))}
              </div>
              
              <div className="space-y-4">
                {activeTab === 'upcoming' && (
                  <>
                    <SessionCard 
                      mentor={{
                        name: "Sophia Reynolds",
                        image: "https://randomuser.me/api/portraits/women/23.jpg",
                        expertise: "Senior Product Manager"
                      }}
                      date="October 15, 2023"
                      time="3:00 PM - 4:00 PM"
                      description="Career advancement strategies for women in tech product management"
                      status="upcoming"
                     
                    />
                    <SessionCard 
                      mentor={{
                        name: "Elena Martinez",
                        image: "https://randomuser.me/api/portraits/women/65.jpg",
                        expertise: "Frontend Tech Lead"
                      }}
                      date="October 18, 2023"
                      time="5:30 PM - 6:30 PM"
                      description="Code review of my portfolio project and feedback session"
                      status="upcoming"
                    
                    />
                  </>
                )}
                
                {activeTab === 'past' && (
                  <>
                    <SessionCard 
                      mentor={{
                        name: "Maya Johnson",
                        image: "https://randomuser.me/api/portraits/women/45.jpg",
                        expertise: "UX Research Manager"
                      }}
                      date="October 5, 2023"
                      time="2:00 PM - 3:00 PM"
                      description="How to conduct user interviews effectively for my research project"
                      status="completed"
                     
                    />
                    <SessionCard 
                      mentor={{
                        name: "Sophia Reynolds",
                        image: "https://randomuser.me/api/portraits/women/23.jpg",
                        expertise: "Senior Product Manager"
                      }}
                      date="September 28, 2023"
                      time="4:00 PM - 5:00 PM"
                      description="Initial career guidance and goal-setting session"
                      status="completed"
                     
                    />
                  </>
                )}
                
                {activeTab === 'requested' && (
                  <SessionCard 
                    mentor={{
                      name: "Rachel Green",
                      image: "https://randomuser.me/api/portraits/women/76.jpg",
                      expertise: "Tech Startup Founder"
                    }}
                    date="October 25, 2023"
                    time="1:00 PM - 2:00 PM"
                    description="Discussing my startup idea and getting initial feedback"
                    status="upcoming"
                    
                  />
                )}
              </div>
            </motion.div>
            
            {/* Recommended Mentors Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recommended Mentors</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button variant="ghost" size="sm" className="text-purple-600 backdrop-blur-sm">
                    <Search className="h-4 w-4 mr-1" />
                    Find More
                  </Button>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <MentorCard 
                  mentor={{
                    name: "Dr. Amelia Wong",
                    image: "https://randomuser.me/api/portraits/women/33.jpg",
                    role: "Data Science Director",
                    company: "TechCorp",
                    rating: 4.9,
                    topics: ["Machine Learning", "Career Growth", "Leadership"],
                    availability: "Available"
                  }}
                  
                />
                <MentorCard 
                  mentor={{
                    name: "Jessica Chen",
                    image: "https://randomuser.me/api/portraits/women/54.jpg",
                    role: "Engineering Manager",
                    company: "InnovateTech",
                    rating: 4.7,
                    topics: ["Software Architecture", "Team Building", "Technical Interviews"],
                    availability: "Limited"
                  }}
                  
                />
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Messages and Events */}
          <div className="space-y-6">
            {/* Messages Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    3
                  </motion.div>
                </div>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button variant="ghost" size="sm" className="text-purple-600 backdrop-blur-sm">
                    View All
                  </Button>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <MessageCard 
                  sender={{
                    name: "Sophia Reynolds",
                    image: "https://randomuser.me/api/portraits/women/23.jpg"
                  }}
                  time="2 hours ago"
                  content="Hi! I've shared some resources for our upcoming session. Could you take a look before we meet?"
                  unread={true}
                  
                />
                <MessageCard 
                  sender={{
                    name: "Elena Martinez",
                    image: "https://randomuser.me/api/portraits/women/65.jpg"
                  }}
                  time="Yesterday"
                  content="Looking forward to our session next week. Don't forget to bring your project questions!"
                  unread={false}
                  
                />
              </div>
            </motion.div>
            
            {/* Upcoming Events Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button variant="ghost" size="sm" className="text-purple-600 backdrop-blur-sm">
                    <Bell className="h-4 w-4 mr-1" />
                    Notify Me
                  </Button>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="border border-gray-200/30 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 w-full rounded-full mb-3"></div>
                  <h3 className="font-medium text-gray-800">Women in Tech Networking</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    October 20, 2023 • 6:00 PM
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Virtual networking event for women in tech across different roles and industries.
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="border border-gray-200/30 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 w-full rounded-full mb-3"></div>
                  <h3 className="font-medium text-gray-800">Technical Interview Workshop</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    October 25, 2023 • 5:00 PM
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Learn effective strategies for technical interviews from experienced hiring managers.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    </div>
    
  );
};

export default MenteeDashboard;