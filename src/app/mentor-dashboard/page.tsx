"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/myComponents/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  Users,
  XCircle,
  BookOpen,
  Star,
  Calendar as CalendarIcon,
  AlertCircle,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for dashboard components
const mentorAppointments = [
  {
    id: "1",
    menteeName: "Jessica Lee",
    menteePhoto: "https://randomuser.me/api/portraits/women/33.jpg",
    date: "2023-09-15",
    time: "10:00 AM - 11:00 AM",
    status: "pending",
    topic: "Career Transition to Tech",
    message: "I would love to discuss how to transition from marketing to product management in tech."
  },
  {
    id: "2",
    menteeName: "Rachel Green",
    menteePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2023-09-18",
    time: "3:00 PM - 4:00 PM",
    status: "accepted",
    topic: "Technical Interview Preparation",
    message: "I have an interview next week and would appreciate your guidance on algorithm questions."
  },
  {
    id: "3",
    menteeName: "Monica Geller",
    menteePhoto: "https://randomuser.me/api/portraits/women/55.jpg",
    date: "2023-09-20",
    time: "2:00 PM - 3:00 PM",
    status: "completed",
    topic: "Leadership in Tech",
    message: "I want to discuss strategies for leading engineering teams effectively."
  },
  {
    id: "4",
    menteeName: "Phoebe Buffay",
    menteePhoto: "https://randomuser.me/api/portraits/women/66.jpg",
    date: "2023-09-22",
    time: "11:00 AM - 12:00 PM",
    status: "declined",
    topic: "Work-Life Balance",
    message: "I'm struggling with burnout and would like to discuss coping strategies."
  }
];

const mentorMessages = [
  {
    id: "1",
    from: "Jessica Lee",
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
    message: "Thank you for accepting my mentorship request! Looking forward to our session.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "2",
    from: "Rachel Green",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "I've shared some resources ahead of our technical interview prep session.",
    time: "Yesterday",
    read: true
  },
  {
    id: "3",
    from: "System Notification",
    photo: "",
    message: "You have 3 new mentee applications to review.",
    time: "2 days ago",
    read: true
  }
];

const mentorStats = {
  totalMentees: 12,
  activeSessionsThisMonth: 8,
  completedSessions: 45,
  averageRating: 4.8,
  hoursContributed: 76
};

const upcomingSessions = [
  {
    id: "1",
    menteeName: "Rachel Green",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "Sep 18, 2023",
    time: "3:00 PM - 4:00 PM",
    topic: "Technical Interview Preparation"
  },
  {
    id: "2",
    menteeName: "Linda Chen",
    photo: "https://randomuser.me/api/portraits/women/28.jpg",
    date: "Sep 25, 2023",
    time: "1:00 PM - 2:00 PM",
    topic: "Frontend Development Best Practices"
  }
];

const MentorDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<any>(null);
  const [appointments, setAppointments] = useState(mentorAppointments);

  useEffect(() => {
    async function fetchMentorData() {
      try {
        const res = await fetch("https://mentorher-backend.vercel.app/api/auth/mentordata" ,{  credentials: "include",});
        const json = await res.json();
        if (json.success && json.data) {
          setMentorData(json.data);
        } else {
          router.push("/BecomeMentor");
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        router.push("/BecomeMentor");
      } finally {
        setLoading(false);
      }
    }
    fetchMentorData();
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

  const handleAccept = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "accepted" } : app
    ));
    toast.success("Appointment accepted", { 
      description: "The mentee has been notified of your acceptance."
    });
  };

  const handleDecline = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "declined" } : app
    ));
    toast.success("Appointment declined", { 
      description: "The mentee has been notified."
    });
  };

  const handleComplete = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: "completed" } : app
    ));
    toast.success("Session marked as completed", {
      description: "Thank you for contributing to the community!"
    });
  };

  const pendingAppointments = appointments.filter(app => app.status === "pending");
  const upcomingAppointments = appointments.filter(app => app.status === "accepted");
  const pastAppointments = appointments.filter(app => app.status === "completed" || app.status === "declined");

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
 
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
        className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full mt-20"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mentor Dashboard</h1>
              <p className="text-gray-600">Manage your mentorship activities and appointments</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/95 text-gray-800 border hover:bg-gray-50/95 backdrop-blur-sm"
                  onClick={() => router.push("/profile/mentor")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Public Profile
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white backdrop-blur-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Availability
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { icon: Users, label: "Total Mentees", value: mentorStats.totalMentees, color: "text-purple-500" },
            { icon: CalendarIcon, label: "This Month's Sessions", value: mentorStats.activeSessionsThisMonth, color: "text-blue-500" },
            { icon: CheckCircle2, label: "Total Sessions", value: mentorStats.completedSessions, color: "text-green-500" },
            { icon: Star, label: "Average Rating", value: `${mentorStats.averageRating}/5`, color: "text-yellow-500" }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <stat.icon className={`h-5 w-5 ${stat.color} mr-2`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="pending">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-white/95 backdrop-blur-md">
                  <TabsTrigger value="pending">
                    Pending Requests
                    {pendingAppointments.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {pendingAppointments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Sessions</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pending" className="mt-0">
                <Card className="bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Pending Mentorship Requests</CardTitle>
                    <CardDescription className="text-gray-600">
                      Review and respond to mentorship session requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingAppointments.length === 0 ? (
                      <div className="py-6 text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                        <p className="text-muted-foreground">No pending requests at the moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {pendingAppointments.map((appointment) => (
                          <motion.div 
                            key={appointment.id} 
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="border border-gray-200/30 rounded-xl p-4 bg-white/90 backdrop-blur-sm shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={appointment.menteePhoto} />
                                  <AvatarFallback>{appointment.menteeName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-gray-800">{appointment.menteeName}</h4>
                                  <p className="text-sm text-gray-600">{appointment.topic}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                Pending
                              </Badge>
                            </div>

                            <div className="mb-4 text-sm">
                              <div className="flex items-center text-gray-600 mb-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {appointment.time}
                              </div>
                            </div>

                            <div className="mb-4 p-3 bg-gray-100/50 rounded-md text-sm">
                              <p className="italic text-gray-700">"{appointment.message}"</p>
                            </div>

                            <div className="flex space-x-2 justify-end">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDecline(appointment.id)}
                                  className="backdrop-blur-sm"
                                >
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Decline
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAccept(appointment.id)}
                                  className="backdrop-blur-sm"
                                >
                                  <CheckCircle2 className="mr-1 h-4 w-4" />
                                  Accept
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                <Card className="bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Upcoming Sessions</CardTitle>
                    <CardDescription className="text-gray-600">
                      View and prepare for your upcoming mentorship sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length === 0 ? (
                      <div className="py-6 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                        <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {upcomingAppointments.map((appointment) => (
                          <motion.div 
                            key={appointment.id} 
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="border border-gray-200/30 rounded-xl p-4 bg-white/90 backdrop-blur-sm shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={appointment.menteePhoto} />
                                  <AvatarFallback>{appointment.menteeName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-gray-800">{appointment.menteeName}</h4>
                                  <p className="text-sm text-gray-600">{appointment.topic}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                Confirmed
                              </Badge>
                            </div>

                            <div className="mb-4 text-sm">
                              <div className="flex items-center text-gray-600 mb-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {appointment.time}
                              </div>
                            </div>

                            <div className="mb-4 p-3 bg-gray-100/50 rounded-md text-sm">
                              <p className="italic text-gray-700">"{appointment.message}"</p>
                            </div>

                            <div className="flex space-x-2 justify-end">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="sm" className="backdrop-blur-sm">
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  Message
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleComplete(appointment.id)}
                                  className="backdrop-blur-sm"
                                >
                                  <CheckCircle2 className="mr-1 h-4 w-4" />
                                  Mark Complete
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                <Card className="bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-gray-800">Past Sessions</CardTitle>
                    <CardDescription className="text-gray-600">
                      Review your past mentorship sessions and outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastAppointments.length === 0 ? (
                      <div className="py-6 text-center">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                        <p className="text-muted-foreground">No past sessions yet.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead>Mentee</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastAppointments.map((appointment) => (
                            <motion.tr 
                              key={appointment.id}
                              variants={itemVariants}
                              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                              className="backdrop-blur-sm"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={appointment.menteePhoto} />
                                    <AvatarFallback>{appointment.menteeName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                  </Avatar>
                                  {appointment.menteeName}
                                </div>
                              </TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.topic}</TableCell>
                              <TableCell>
                                {appointment.status === "completed" ? (
                                  <Badge className="bg-green-50 text-green-700 border-green-200">
                                    Completed
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                    Declined
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {appointment.status === "completed" && (
                                  <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button variant="ghost" size="sm">
                                      <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                )}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Messages and Events */}
          <div className="lg:col-span-1 space-y-6">
            {/* Messages card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BellRing className="h-5 w-5 text-primary/70" />
                    Messages 
                    <Badge className="ml-2 rounded-full px-1 min-w-[20px] h-5 flex items-center justify-center">
                      {mentorMessages.filter(m => !m.read).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentorMessages.map((message) => (
                      <motion.div 
                        key={message.id} 
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        className={`flex items-start gap-3 p-3 rounded-md ${!message.read ? 'bg-purple-50/50' : 'bg-white/80'}`}
                      >
                        {message.photo ? (
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={message.photo} />
                            <AvatarFallback>{message.from.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10">
                            <BellRing className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <p className="text-sm font-medium text-gray-800">{message.from}</p>
                            <span className="text-xs text-gray-600">{message.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {message.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full mt-4 backdrop-blur-sm">
                      View All Messages
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar widget */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-5 w-5 text-primary/70" /> 
                    Your Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <motion.div 
                        key={session.id}
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                        className="flex items-start gap-3 border-b border-gray-200/30 pb-3 last:border-0"
                      >
                        <div className="bg-purple-100/50 text-purple-600 rounded-md p-2 flex flex-col items-center min-w-14 text-center">
                          <span className="text-xs font-medium">{session.date.split(",")[0]}</span>
                          <span className="text-lg font-bold">{session.date.split(" ")[1]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{session.topic}</p>
                          <p className="text-xs text-gray-600 mb-1">with {session.menteeName}</p>
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="mr-1 h-3 w-3" />
                            {session.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full mt-4 backdrop-blur-sm">
                      View Full Calendar
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <motion.div whileHover={{ y: -2 }}>
                    <Button variant="outline" className="justify-start backdrop-blur-sm">
                      <Users className="mr-2 h-4 w-4" />
                      Review Mentee Applications
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }}>
                    <Button variant="outline" className="justify-start backdrop-blur-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Update Availability
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }}>
                    <Button variant="outline" className="justify-start backdrop-blur-sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Add Resources
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.main>

      <footer className="border-t border-gray-200/30 mt-20 bg-white/5 backdrop-blur-sm">
        <div className="container py-8 text-center text-sm text-gray-600">
          <p>© 2023 Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorDashboard;