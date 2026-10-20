"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import StatsCard from '../../myComponents/mentee-dashboard/StatsCard';
import SessionCard from '../../myComponents/mentee-dashboard/SessionsCard';
import MentorCard from '../../myComponents/mentee-dashboard/MentorCard';
import MessageCard from '../../myComponents/mentee-dashboard/MessageCard';
import RequestSessionDialog from '../../myComponents/mentee-dashboard/RequestSessionDialog';
import Loader from '@/components/Loader';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import {
  Users, Calendar, Clock,
  BookOpen, Search, Bell, Calendar as CalendarIcon,
  AlertTriangle, Activity, MessageSquare, CheckCheck
} from 'lucide-react';
import Navbar from '@/myComponents/Navbar';
import { apiFetch, ApiError, errorMessage } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { formatDate, formatTime, timeAgo } from '@/lib/format';
import { toast } from 'sonner';

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
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  mentor: PersonBrief | null;
}

interface DashboardData {
  profile: { fullName: string; profilePhoto: string; currentStatus: string };
  stats: {
    myMentors: number;
    upcomingSessions: number;
    hoursOfMentorship: number;
    completedSessions: number;
    pendingRequests: number;
  };
  sessions: { upcoming: SessionRequest[]; past: SessionRequest[]; requested: SessionRequest[] };
  activity: { _id: string; type: string; text: string; date: string }[];
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

interface RecommendedMentor {
  similarity: number;
  mentor: {
    mentorId?: string;
    userId: string;
    fullName: string;
    profilePhoto?: string;
    currentRole?: string;
    company?: string;
    technicalSkills?: string[];
    areasOfInterest?: string[];
    availability?: { day: string; startTime: string; endTime: string }[];
  };
}

interface RegisteredEvent {
  _id: string;
  title: string;
  date: string;
  time: string;
}

type LoadState = 'loading' | 'ready' | 'error';

const MenteeDashboard = () => {
  const router = useRouter();
  const { status: authStatus, user } = useAuth();

  const [dash, setDash] = useState<DashboardData | null>(null);
  const [dashState, setDashState] = useState<LoadState>('loading');
  const [dashError, setDashError] = useState('');

  const [recommendations, setRecommendations] = useState<RecommendedMentor[]>([]);
  const [recsState, setRecsState] = useState<LoadState>('loading');
  const [recsError, setRecsError] = useState('');

  const [events, setEvents] = useState<RegisteredEvent[]>([]);
  const [eventsState, setEventsState] = useState<LoadState>('loading');

  const [activeTab, setActiveTab] = useState('upcoming');
  const [requestMentor, setRequestMentor] = useState<{ userId: string; name: string } | null>(null);

  // Redirect to login while unauthenticated (never render fake dashboard data).
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [authStatus, router]);

  const loadDashboard = useCallback(async () => {
    setDashState('loading');
    try {
      const data = await apiFetch<DashboardData>('/api/dashboard/mentee');
      setDash(data);
      setDashState('ready');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        // No mentee profile in MongoDB yet.
        router.replace('/Become-mentee');
        return;
      }
      setDashError(errorMessage(error));
      setDashState('error');
    }
  }, [router]);

  const loadRecommendations = useCallback(async () => {
    if (!user?._id) return;
    setRecsState('loading');
    try {
      const data = await apiFetch<{ recommendations: RecommendedMentor[] }>(
        `/api/recommendations?userId=${user._id}`
      );
      setRecommendations(data.recommendations ?? []);
      setRecsState('ready');
    } catch (error) {
      setRecsError(errorMessage(error));
      setRecsState('error');
    }
  }, [user?._id]);

  const loadEvents = useCallback(async () => {
    setEventsState('loading');
    try {
      const data = await apiFetch<{ events: RegisteredEvent[] }>('/api/auth/Events');
      setEvents(data.events ?? []);
      setEventsState('ready');
    } catch (error) {
      setEventsState('error');
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      loadDashboard();
      loadRecommendations();
      loadEvents();
    }
  }, [authStatus, loadDashboard, loadRecommendations, loadEvents]);

  const handleMarkAllRead = async () => {
    try {
      await apiFetch('/api/messages/read', { method: 'POST' });
      toast.success('Messages marked as read');
      loadDashboard();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren' as const,
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
        ease: 'easeOut' as const,
      },
    },
  };

  // AUTH_LOADING -> Loader
  if (authStatus === 'loading' || dashState === 'loading') {
    return <Loader fullPage size="lg" label="Loading your dashboard..." />;
  }

  if (dashState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="max-w-xl mx-auto pt-32 px-4">
          <EmptyState
            icon={AlertTriangle}
            title="Could not load your dashboard"
            description={dashError}
            action={
              <Button
                onClick={() => {
                  setDashState('loading');
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

  if (!dash) return null;

  const { stats, sessions, activity, messages, profile } = dash;
  const sessionList =
    activeTab === 'upcoming' ? sessions.upcoming : activeTab === 'past' ? sessions.past : sessions.requested;

  const sessionStatus = (status: SessionRequest['status']) =>
    status === 'accepted' ? 'upcoming' : status === 'completed' ? 'completed' : status === 'declined' ? 'canceled' : 'pending';

  const statCards = [
    { icon: Users, label: 'My Mentors', value: stats.myMentors, iconColor: 'text-purple-500' },
    { icon: CalendarIcon, label: 'Upcoming Sessions', value: stats.upcomingSessions, iconColor: 'text-blue-500' },
    { icon: Clock, label: 'Hours of Mentorship', value: stats.hoursOfMentorship, iconColor: 'text-pink-500' },
    { icon: BookOpen, label: 'Completed Sessions', value: stats.completedSessions, iconColor: 'text-teal-500' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 pt-16">
      {/* Subtle floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-purple-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-36 sm:w-56 lg:w-72 h-36 sm:h-56 lg:h-72 bg-blue-100/20 rounded-full mix-blend-overlay filter blur-xl"
      />

      <Navbar />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Welcome back, {profile.fullName || user?.username || 'Mentee'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Track your mentorship journey and upcoming sessions</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto bg-white text-gray-800 border hover:bg-gray-50 backdrop-blur-sm text-sm sm:text-base"
                  onClick={() => router.push('/find-mentor')}
                >
                  Find Mentors
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white backdrop-blur-sm text-sm sm:text-base"
                  onClick={() => router.push('/profile/mentee')}
                >
                  View Public Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StatsCard icon={stat.icon} label={stat.label} value={stat.value} iconColor={stat.iconColor} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sessions and Mentors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sessions Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Sessions</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-200 backdrop-blur-sm text-sm"
                    onClick={() => setActiveTab('upcoming')}
                  >
                    View All
                  </Button>
                </motion.div>
              </div>

              <div className="flex flex-wrap border-b border-gray-200 mb-6">
                {['upcoming', 'past', 'requested'].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'upcoming' ? 'Upcoming' : tab === 'past' ? 'Past Sessions' : 'Requested'}
                  </motion.button>
                ))}
              </div>

              <div className="space-y-4">
                {sessionList.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title={
                      activeTab === 'upcoming'
                        ? 'No upcoming sessions'
                        : activeTab === 'past'
                          ? 'No past sessions yet'
                          : 'No pending session requests'
                    }
                    description={
                      activeTab === 'requested'
                        ? 'Session requests you send to mentors will appear here.'
                        : 'Find a mentor and request a session to get started.'
                    }
                    action={
                      activeTab !== 'requested' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 border-purple-200"
                          onClick={() => router.push('/find-mentor')}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Find Mentors
                        </Button>
                      ) : undefined
                    }
                  />
                ) : (
                  sessionList.map((session) => (
                    <SessionCard
                      key={session._id}
                      mentor={{
                        name: session.mentor?.fullName || 'Unknown mentor',
                        image: session.mentor?.profilePhoto,
                        expertise: [session.mentor?.role, session.mentor?.company].filter(Boolean).join(' at '),
                      }}
                      date={formatDate(session.date)}
                      time={session.time?.includes('-') ? session.time : formatTime(session.time)}
                      description={session.message || session.topic}
                      status={sessionStatus(session.status)}
                    />
                  ))
                )}
              </div>
            </motion.div>

            {/* Recommended Mentors Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recommended Mentors</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 backdrop-blur-sm text-sm"
                    onClick={() => router.push(`/recommendations?userId=${user?._id}`)}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Find More
                  </Button>
                </motion.div>
              </div>

              {recsState === 'loading' ? (
                <Loader label="Finding mentors for you..." />
              ) : recsState === 'error' ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="Could not load recommendations"
                  description={recsError}
                  action={
                    <Button variant="outline" size="sm" onClick={loadRecommendations}>
                      Try again
                    </Button>
                  }
                />
              ) : recommendations.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No mentor recommendations yet"
                  description="Complete your mentee profile and check back once mentors join the platform."
                />
              ) : (
                <div className="space-y-4">
                  {recommendations.map(({ mentor }) => (
                    <MentorCard
                      key={mentor.userId}
                      mentor={{
                        userId: mentor.userId,
                        name: mentor.fullName,
                        image: mentor.profilePhoto,
                        role: mentor.currentRole,
                        company: mentor.company,
                        topics: [...(mentor.technicalSkills ?? []), ...(mentor.areasOfInterest ?? [])].slice(0, 4),
                        availability: (mentor.availability?.length ?? 0) > 0 ? 'Available' : undefined,
                      }}
                      onClick={() => router.push(`/profile/mentor/${mentor.userId}`)}
                      onRequest={() => setRequestMentor({ userId: mentor.userId, name: mentor.fullName })}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Messages, Events and Activity */}
          <div className="space-y-6">
            {/* Messages Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Messages</h2>
                  {messages.unreadCount > 0 && (
                    <span className="ml-2 bg-purple-500 text-white text-xs rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                      {messages.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {messages.unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 backdrop-blur-sm text-sm"
                      onClick={handleMarkAllRead}
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 backdrop-blur-sm text-sm"
                    onClick={() => router.push('/network')}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </div>
              </div>

              {messages.recent.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="No messages yet"
                  description="Messages from your mentors will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {messages.recent.map((message) => (
                    <MessageCard
                      key={message._id}
                      sender={{
                        name: message.from?.fullName || 'Member',
                        image: message.from?.profilePhoto,
                      }}
                      time={timeAgo(message.createdAt)}
                      content={message.content}
                      unread={!message.read}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Upcoming Events Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">My Events</h2>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 backdrop-blur-sm text-sm"
                    onClick={() => router.push('/#events')}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Browse Events
                  </Button>
                </motion.div>
              </div>

              {eventsState === 'loading' ? (
                <Loader label="Loading your events..." />
              ) : eventsState === 'error' ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="Could not load events"
                  action={
                    <Button variant="outline" size="sm" onClick={loadEvents}>
                      Try again
                    </Button>
                  }
                />
              ) : events.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No registered events"
                  description="Register for an event and it will show up here."
                />
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <motion.div
                      key={event._id}
                      whileHover={{ y: -3 }}
                      className="border border-gray-200/30 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 w-full rounded-full mb-3"></div>
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">{event.title}</h3>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        {formatDate(event.date)} {event.time && `• ${formatTime(event.time)}`}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Activity Card */}
            <motion.div variants={itemVariants} className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Activity</h2>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>

              {activity.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No activity yet"
                  description="Your session requests and updates will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start gap-3 text-sm border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                          item.type === 'session_completed'
                            ? 'bg-green-500'
                            : item.type === 'session_declined'
                              ? 'bg-red-400'
                              : item.type === 'session_accepted'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-gray-700">{item.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.main>

      {requestMentor && (
        <RequestSessionDialog
          open={!!requestMentor}
          mentorUserId={requestMentor.userId}
          mentorName={requestMentor.name}
          onClose={() => setRequestMentor(null)}
          onSuccess={loadDashboard}
        />
      )}
    </div>
  );
};

export default MenteeDashboard;
