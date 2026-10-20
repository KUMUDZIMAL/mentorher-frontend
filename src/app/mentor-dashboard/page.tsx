"use client";
import { useCallback, useEffect, useState } from "react";
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
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  Users,
  XCircle,
  BookOpen,
  Calendar as CalendarIcon,
  AlertCircle,
  BellRing,
  AlertTriangle,
  CheckCheck,
  Settings,
  UserCircle,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { formatDate, formatTime, dateParts, timeAgo } from "@/lib/format";

interface PersonBrief {
  userId?: string;
  fullName?: string;
  profilePhoto?: string;
  role?: string;
  company?: string;
}

interface SessionRequest {
  _id: string;
  topic: string;
  message?: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
  mentor: PersonBrief | null;
  mentee: PersonBrief | null;
}

interface MentorDashboardData {
  profile: { fullName: string; profilePhoto: string; currentRole: string; company: string };
  stats: {
    totalMentees: number;
    sessionsThisMonth: number;
    totalSessions: number;
    pendingRequests: number;
  };
  requests: { pending: SessionRequest[]; upcoming: SessionRequest[]; past: SessionRequest[] };
  schedule: SessionRequest[];
  messages: {
    recent: {
      _id: string;
      content: string;
      read: boolean;
      createdAt: string;
      from: PersonBrief | null;
    }[];
    unreadCount: number;
  };
}

type LoadState = "loading" | "ready" | "error";

const MentorDashboard = () => {
  const router = useRouter();
  const { status: authStatus, user } = useAuth();

  const [data, setData] = useState<MentorDashboardData | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [authStatus, router]);

  const loadDashboard = useCallback(async () => {
    setState("loading");
    try {
      const result = await apiFetch<MentorDashboardData>("/api/dashboard/mentor");
      setData(result);
      setState("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // No mentor profile in MongoDB yet.
        router.replace("/BecomeMentor");
        return;
      }
      setError(errorMessage(err));
      setState("error");
    }
  }, [router]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      loadDashboard();
    }
  }, [authStatus, loadDashboard]);

  const updateStatus = async (id: string, status: "accepted" | "declined" | "completed") => {
    setActionId(id);
    try {
      await apiFetch(`/api/requests/${id}`, { method: "PATCH", body: { status } });
      toast.success(
        status === "accepted"
          ? "Request accepted"
          : status === "declined"
            ? "Request declined"
            : "Session marked as completed",
        { description: "The mentee has been notified." }
      );
      await loadDashboard();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiFetch("/api/messages/read", { method: "POST" });
      toast.success("Messages marked as read");
      loadDashboard();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren" as const,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  // AUTH_LOADING -> Loader
  if (authStatus === "loading" || state === "loading") {
    return <Loader fullPage size="lg" label="Loading your dashboard..." />;
  }

  if (state === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-xl mx-auto pt-32 px-4">
          <EmptyState
            icon={AlertTriangle}
            title="Could not load your dashboard"
            description={error}
            action={
              <Button
                onClick={() => {
                  setState("loading");
                  loadDashboard();
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                Try again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, requests, schedule, messages, profile } = data;
  const pendingAppointments = requests.pending;
  const upcomingAppointments = requests.upcoming;
  const pastAppointments = requests.past;

  const menteeLabel = (appointment: SessionRequest) => appointment.mentee?.fullName || "Mentee";
  const menteePhoto = (appointment: SessionRequest) => appointment.mentee?.profilePhoto || "";
  const menteeInitials = (appointment: SessionRequest) =>
    menteeLabel(appointment)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const statCards = [
    { icon: Users, label: "Total Mentees", value: stats.totalMentees, color: "text-purple-500" },
    { icon: CalendarIcon, label: "This Month's Sessions", value: stats.sessionsThisMonth, color: "text-blue-500" },
    { icon: CheckCircle2, label: "Total Sessions", value: stats.totalSessions, color: "text-green-500" },
    { icon: AlertCircle, label: "Pending Requests", value: stats.pendingRequests, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />

      <Navbar />

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
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {profile.fullName || user?.username || "Mentor"}
              </h1>
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
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white backdrop-blur-sm"
                  onClick={() => router.push("/set-availability")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Availability
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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
                      <EmptyState
                        icon={AlertCircle}
                        title="No pending requests at the moment"
                        description="New session requests from mentees will appear here."
                      />
                    ) : (
                      <div className="space-y-6">
                        {pendingAppointments.map((appointment) => (
                          <motion.div
                            key={appointment._id}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="border border-gray-200/30 rounded-xl p-4 bg-white/90 backdrop-blur-sm shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={menteePhoto(appointment)} />
                                  <AvatarFallback>{menteeInitials(appointment)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-gray-800">{menteeLabel(appointment)}</h4>
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
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {appointment.time?.includes("-")
                                  ? appointment.time
                                  : `${formatTime(appointment.time)}`}
                              </div>
                            </div>

                            {appointment.message && (
                              <div className="mb-4 p-3 bg-gray-100/50 rounded-md text-sm">
                                <p className="italic text-gray-700">"{appointment.message}"</p>
                              </div>
                            )}

                            <div className="flex space-x-2 justify-end">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={actionId === appointment._id}
                                  onClick={() => updateStatus(appointment._id, "declined")}
                                  className="backdrop-blur-sm"
                                >
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Decline
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  disabled={actionId === appointment._id}
                                  onClick={() => updateStatus(appointment._id, "accepted")}
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
                      <EmptyState
                        icon={Calendar}
                        title="No upcoming sessions scheduled"
                        description="Accepted session requests will show up here."
                      />
                    ) : (
                      <div className="space-y-6">
                        {upcomingAppointments.map((appointment) => (
                          <motion.div
                            key={appointment._id}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="border border-gray-200/30 rounded-xl p-4 bg-white/90 backdrop-blur-sm shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={menteePhoto(appointment)} />
                                  <AvatarFallback>{menteeInitials(appointment)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-gray-800">{menteeLabel(appointment)}</h4>
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
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {appointment.time?.includes("-")
                                  ? appointment.time
                                  : `${formatTime(appointment.time)}`}
                              </div>
                            </div>

                            {appointment.message && (
                              <div className="mb-4 p-3 bg-gray-100/50 rounded-md text-sm">
                                <p className="italic text-gray-700">"{appointment.message}"</p>
                              </div>
                            )}

                            <div className="flex space-x-2 justify-end">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="backdrop-blur-sm"
                                  disabled={!appointment.mentee?.userId}
                                  onClick={() =>
                                    appointment.mentee?.userId &&
                                    router.push(`/chat/${appointment.mentee.userId}`)
                                  }
                                >
                                  <MessageSquare className="mr-1 h-4 w-4" />
                                  Message
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  disabled={actionId === appointment._id}
                                  onClick={() => updateStatus(appointment._id, "completed")}
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
                      <EmptyState
                        icon={BookOpen}
                        title="No past sessions yet"
                        description="Completed and declined requests will be listed here."
                      />
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
                              key={appointment._id}
                              variants={itemVariants}
                              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                              className="backdrop-blur-sm"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={menteePhoto(appointment)} />
                                    <AvatarFallback>{menteeInitials(appointment)}</AvatarFallback>
                                  </Avatar>
                                  {menteeLabel(appointment)}
                                </div>
                              </TableCell>
                              <TableCell>{formatDate(appointment.date)}</TableCell>
                              <TableCell>{appointment.topic}</TableCell>
                              <TableCell>
                                {appointment.status === "completed" ? (
                                  <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                    {appointment.status === "declined" ? "Declined" : "Ended"}
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

          {/* Right Column - Messages, Schedule and Quick links */}
          <div className="lg:col-span-1 space-y-6">
            {/* Messages card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BellRing className="h-5 w-5 text-primary/70" />
                    Messages
                    {messages.unreadCount > 0 && (
                      <Badge className="ml-2 rounded-full px-1 min-w-[20px] h-5 flex items-center justify-center">
                        {messages.unreadCount}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.recent.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages yet"
                      description="Messages from your mentees will appear here."
                    />
                  ) : (
                    <div className="space-y-4">
                      {messages.recent.map((message) => (
                        <motion.div
                          key={message._id}
                          variants={itemVariants}
                          whileHover={{ y: -2 }}
                          className={`flex items-start gap-3 p-3 rounded-md ${!message.read ? "bg-purple-50/50" : "bg-white/80"}`}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={message.from?.profilePhoto} />
                            <AvatarFallback>
                              {(message.from?.fullName || "M")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <p className="text-sm font-medium text-gray-800">
                                {message.from?.fullName || "Member"}
                              </p>
                              <span className="text-xs text-gray-600">{timeAgo(message.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{message.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    {messages.unreadCount > 0 && (
                      <Button variant="outline" className="w-full backdrop-blur-sm" onClick={handleMarkAllRead}>
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Mark all as read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full backdrop-blur-sm"
                      onClick={() => router.push("/network")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Schedule widget */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-5 w-5 text-primary/70" />
                    Your Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {schedule.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="Nothing scheduled"
                      description="Accepted sessions will appear on your schedule."
                    />
                  ) : (
                    <div className="space-y-4">
                      {schedule.map((session) => {
                        const parts = dateParts(session.date);
                        return (
                          <motion.div
                            key={session._id}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="flex items-start gap-3 border-b border-gray-200/30 pb-3 last:border-0"
                          >
                            <div className="bg-purple-100/50 text-purple-600 rounded-md p-2 flex flex-col items-center min-w-14 text-center">
                              <span className="text-xs font-medium">{parts.month}</span>
                              <span className="text-lg font-bold">{parts.day}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{session.topic}</p>
                              <p className="text-xs text-gray-600 mb-1">with {menteeLabel(session)}</p>
                              <div className="flex items-center text-xs text-gray-600">
                                <Clock className="mr-1 h-3 w-3" />
                                {session.time?.includes("-") ? session.time : formatTime(session.time)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4 backdrop-blur-sm"
                    onClick={() => router.push("/set-availability")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Update Availability
                  </Button>
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
                    <Button
                      variant="outline"
                      className="justify-start backdrop-blur-sm w-full"
                      onClick={() => router.push("/profile/mentor")}
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      View Public Profile
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }}>
                    <Button
                      variant="outline"
                      className="justify-start backdrop-blur-sm w-full"
                      onClick={() => router.push("/set-availability")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Update Availability
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }}>
                    <Button
                      variant="outline"
                      className="justify-start backdrop-blur-sm w-full"
                      onClick={() => router.push("/forum")}
                    >
                      <UsersRound className="mr-2 h-4 w-4" />
                      Community Forum
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
          <p>© {new Date().getFullYear()} MentorHer — Women in Tech Mentorship Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MentorDashboard;
