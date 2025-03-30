"use client";

import React, { useState } from 'react';
import { MessageSquare, Heart, Users, Plus, Search, ArrowRight, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// Define types for better type safety
interface User {
    name: string;
    role: string;
}

interface Comment {
    id: number;
    user: User;
    content: string;
    time: string;
}

interface Discussion {
    id: number;
    user: User;
    time: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    tags: string[];
    commentList: Comment[];
}

interface Community {
    id: number;
    name: string;
    members: number;
    joined: boolean;
}

export default function DiscussionForum() {
    // State for discussions with explicit typing
    const [discussions, setDiscussions] = useState<Discussion[]>([
        {
            id: 1,
            user: { name: "Priya Sharma", role: "UX Designer" },
            time: "2h ago",
            title: "How do you handle creative burnout?",
            content: "I've been feeling completely drained after back-to-back projects. What strategies do you use to recharge creatively?",
            likes: 24,
            comments: 8,
            tags: ["Mental Health", "Creativity"],
            commentList: [
                {
                    id: 1,
                    user: { name: "Ananya Patel", role: "Frontend Dev" },
                    content: "Take short breaks, try new creative hobbies outside work. Meditation helps too!",
                    time: "1h ago"
                }
            ]
        },
        {
            id: 2,
            user: { name: "Ananya Patel", role: "Frontend Dev" },
            time: "5h ago",
            title: "Best resources for learning React 18?",
            content: "Looking for up-to-date tutorials with hooks and concurrent rendering examples. Any recommendations?",
            likes: 18,
            comments: 12,
            tags: ["Technical", "Learning"],
            commentList: []
        }
    ]);

    // State for new post modal
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
    const [newPost, setNewPost] = useState<{
        title: string;
        content: string;
        tags: string;
    }>({
        title: '',
        content: '',
        tags: ''
    });

    // State for comments with proper typing
    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

    // Communities state with join functionality
    const [communities, setCommunities] = useState<Community[]>([
        { id: 1, name: "Women in Tech", members: 1243, joined: false },
        { id: 2, name: "UX Designers", members: 872, joined: false },
        { id: 3, name: "Remote Workers", members: 1560, joined: false }
    ]);

    // Function to add a new post
    const handleAddPost = () => {
        if (!newPost.title || !newPost.content) {
            alert('Please fill in both title and content');
            return;
        }

        const post: Discussion = {
            id: discussions.length + 1,
            user: { name: "Current User", role: "Community Member" },
            time: "Just now",
            title: newPost.title,
            content: newPost.content,
            likes: 0,
            comments: 0,
            tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            commentList: []
        };

        setDiscussions([post, ...discussions]);
        setNewPost({ title: '', content: '', tags: '' });
        setIsNewPostModalOpen(false);
    };

    // Function to add a comment to a specific post
    const handleAddComment = (postId: number) => {
        const commentText = newComment[postId];
        if (!commentText) return;

        const updatedDiscussions = discussions.map(post => {
            if (post.id === postId) {
                const comment: Comment = {
                    id: post.commentList.length + 1,
                    user: { name: "Current User", role: "Community Member" },
                    content: commentText,
                    time: "Just now"
                };

                return {
                    ...post,
                    comments: post.comments + 1,
                    commentList: [...post.commentList, comment]
                };
            }
            return post;
        });

        setDiscussions(updatedDiscussions);
        setNewComment(prev => ({ ...prev, [postId]: '' }));
    };

    // Function to handle likes
    const handleLike = (postId: number) => {
        const updatedDiscussions = discussions.map(post =>
            post.id === postId
                ? { ...post, likes: post.likes + 1 }
                : post
        );

        setDiscussions(updatedDiscussions);
    };

    // Function to handle joining communities
    const handleJoinCommunity = (communityId: number) => {
        setCommunities(communities.map(community =>
            community.id === communityId
                ? { ...community, joined: !community.joined }
                : community
        ));
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Blob Background */}
            <div className="fixed inset-0 z-[-2] overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl animate-float animation-delay-0"></div>
                <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
                <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl animate-float animation-delay-6000"></div>
            </div>

            {/* Glass Overlay */}
            <div className="fixed inset-0 z-[-1] backdrop-blur-[100px] bg-white/10" />

            <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">MentorHer Forum</h1>
                    <p className="text-gray-600/90">Where women in tech connect and grow</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Discussions */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Search/Create */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500/80" />
                                <Input
                                    placeholder="Search discussions..."
                                    className="pl-10 bg-white/70 border-0 focus:bg-white/90 focus-visible:ring-2 focus-visible:ring-purple-200/50 shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => setIsNewPostModalOpen(true)}
                                className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white shadow-sm hover:shadow-md transition-all"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Post
                            </Button>
                        </div>

                        {/* New Post Modal */}
                        {isNewPostModalOpen && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                    <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                                    <Input
                                        placeholder="Post Title"
                                        className="mb-3"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    />
                                    <Textarea
                                        placeholder="What's on your mind?"
                                        className="mb-3 min-h-[150px]"
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Tags (comma separated)"
                                        className="mb-4"
                                        value={newPost.tags}
                                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsNewPostModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddPost}
                                            className="bg-purple-500 text-white hover:bg-purple-600"
                                        >
                                            Post
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Discussion Feed */}
                        <div className="space-y-4">
                            {discussions.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/90 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200/50"
                                >
                                    <div className="flex gap-4">
                                        <Avatar className="h-11 w-11 border-2 border-white/90 shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-gray-700">
                                                {post.user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                                                <span className="text-sm text-gray-500/80">• {post.user.role}</span>
                                                <span className="text-sm text-gray-400/80 ml-auto">{post.time}</span>
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h2>
                                            <p className="text-gray-600/90 mb-3">{post.content}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-0.5 text-xs rounded-full bg-gradient-to-r from-purple-100/50 to-pink-100/50 text-purple-800/90 border border-white/80"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-3 mb-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleLike(post.id)}
                                                    className="text-gray-600/90 hover:text-pink-500/90 hover:bg-pink-50/50 transition-colors"
                                                >
                                                    <Heart className="h-4 w-4 mr-1.5" />
                                                    {post.likes}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600/90 hover:text-purple-500/90 hover:bg-purple-50/50 transition-colors"
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-1.5" />
                                                    {post.comments}
                                                </Button>
                                            </div>

                                            {/* Comments Section */}
                                            <div className="space-y-3 mb-3">
                                                {post.commentList.map((comment) => (
                                                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-sm">{comment.user.name}</h4>
                                                            <span className="text-xs text-gray-500">{comment.time}</span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{comment.content}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Comment */}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add a comment..."
                                                    value={newComment[post.id] || ''}
                                                    onChange={(e) => setNewComment({
                                                        ...newComment,
                                                        [post.id]: e.target.value
                                                    })}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleAddComment(post.id)}
                                                    disabled={!newComment[post.id]}
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Communities */}
                    <div className="space-y-5">
                        {/* Communities Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/90 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600/90" />
                                    Your Communities
                                </h2>
                                <Link href="/create-group" passHref>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className=" bg-violet-100 glow-effect text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 
                                                    relative overflow-hidden transition-all duration-300
                                                    hover:shadow-[0_0_10px_2px_rgba(168,85,247,0.3)]"
                                >
                                    <Plus className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-90" />
                                    <span className="relative z-10">Join New</span>
                                </Button>
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {communities.map((community) => (
                                    <div
                                        key={community.id}
                                        className="group bg-white/90 hover:bg-white border border-white/90 rounded-xl p-3.5 shadow-xs hover:shadow-sm transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gradient-to-r from-purple-200/40 to-pink-200/40 p-2 rounded-lg group-hover:from-purple-300/40 group-hover:to-pink-300/40 transition-all">
                                                <Users className="h-5 w-5 text-purple-600/80 group-hover:text-purple-700/80" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 group-hover:text-purple-800/90 transition-colors">
                                                    {community.name}
                                                </h3>
                                                <p className="text-xs text-gray-500/80">{community.members.toLocaleString()} members</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={community.joined ? "outline" : "default"}
                                                onClick={() => handleJoinCommunity(community.id)}
                                                className={`transition-all ${community.joined
                                                        ? "border-purple-300 text-purple-600 hover:bg-purple-50"
                                                        : "bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white"
                                                    }`}
                                            >
                                                {community.joined ? "Joined" : "Join"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Guidelines Card */}
                        <div className="bg-gradient-to-br from-purple-50/70 to-pink-50/70 backdrop-blur-sm rounded-2xl p-5 border border-white/90 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Community Guidelines</h2>
                            <ul className="space-y-2 text-sm text-gray-700/90">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500/80">•</span>
                                    <span>Be kind and inclusive</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500/80">•</span>
                                    <span>Share knowledge generously</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-500/80">•</span>
                                    <span>Respect privacy boundaries</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blob Animation Styles */}
            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(10px) translateX(-10px); }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
        </div>
    );
}