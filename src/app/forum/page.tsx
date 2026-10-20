"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Heart, Users, Plus, Search, Send, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Navbar from "@/myComponents/Navbar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { apiFetch, errorMessage } from "@/lib/api";
import { timeAgo } from "@/lib/format";

interface Comment {
    _id: string;
    author: { userId?: string; name: string };
    content: string;
    createdAt: string;
}

interface Post {
    _id: string;
    author: { userId: string; name: string; role?: string };
    title: string;
    content: string;
    tags: string[];
    likes: number;
    likedByMe: boolean;
    comments: Comment[];
    createdAt: string;
}

interface Group {
    _id: string;
    name: string;
    participants: { username: string }[];
}

export default function DiscussionForum() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
    const [newPost, setNewPost] = useState<{ title: string; content: string; tags: string }>({
        title: "",
        content: "",
        tags: "",
    });
    const [postError, setPostError] = useState("");
    const [posting, setPosting] = useState(false);
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [postsRes, groupsRes] = await Promise.all([
                apiFetch<{ posts?: Post[] }>("/api/posts"),
                apiFetch<{ groups?: any[] }>("/api/groups"),
            ]);
            setPosts(postsRes.posts ?? []);
            setGroups(
                (groupsRes.groups ?? []).map((g) => ({
                    _id: String(g._id),
                    name: g.name,
                    participants: g.participants ?? [],
                }))
            );
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const visiblePosts = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return posts;
        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.tags.some((tag) => tag.toLowerCase().includes(query))
        );
    }, [posts, search]);

    const handleAddPost = async () => {
        if (!newPost.title || !newPost.content) {
            setPostError("Please fill in both title and content.");
            return;
        }
        setPosting(true);
        setPostError("");
        try {
            const res = await apiFetch<{ post?: Post }>("/api/posts", {
                method: "POST",
                body: {
                    title: newPost.title,
                    content: newPost.content,
                    tags: newPost.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                },
            });
            if (res.post) setPosts((prev) => [res.post!, ...prev]);
            setNewPost({ title: "", content: "", tags: "" });
            setIsNewPostModalOpen(false);
        } catch (err) {
            setPostError(errorMessage(err));
        } finally {
            setPosting(false);
        }
    };

    const handleAddComment = async (postId: string) => {
        const commentText = newComment[postId];
        if (!commentText || !commentText.trim()) return;
        try {
            const res = await apiFetch<{ comment?: Comment }>(`/api/posts/${postId}`, {
                method: "PATCH",
                body: { action: "comment", content: commentText },
            });
            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId && res.comment
                        ? { ...post, comments: [...post.comments, res.comment] }
                        : post
                )
            );
            setNewComment((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            alert(errorMessage(err));
        }
    };

    const handleLike = async (postId: string) => {
        try {
            const res = await apiFetch<{ likes: number; likedByMe: boolean }>(`/api/posts/${postId}`, {
                method: "PATCH",
                body: { action: "like" },
            });
            setPosts((prev) =>
                prev.map((post) =>
                    post._id === postId
                        ? { ...post, likes: res.likes, likedByMe: res.likedByMe }
                        : post
                )
            );
        } catch (err) {
            alert(errorMessage(err));
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="fixed inset-0 z-[-2] overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl animate-float animation-delay-0"></div>
                <div className="absolute top-1/3 right-0 w-[35rem] h-[35rem] bg-pink-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
                <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-3xl animate-float animation-delay-6000"></div>
            </div>

            {/* Glass Overlay */}
            <div className="fixed inset-0 z-[-1] backdrop-blur-[100px] bg-white/10" />
            <Navbar></Navbar>
            <div className="max-w-7xl mx-auto p-4 md:p-8 relative mt-20">
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
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={() => {
                                    setPostError("");
                                    setIsNewPostModalOpen(true);
                                }}
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
                                    {postError && <p className="mb-3 text-sm text-red-600">{postError}</p>}
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsNewPostModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddPost}
                                            disabled={posting}
                                            className="bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-60"
                                        >
                                            {posting ? "Posting..." : "Post"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Discussion Feed */}
                        {loading && <Loader size="lg" label="Loading discussions..." />}

                        {!loading && error && (
                            <EmptyState
                                icon={AlertTriangle}
                                title="Could not load discussions"
                                description={error}
                                action={
                                    <Button onClick={loadData} className="bg-purple-500 text-white hover:bg-purple-600">
                                        Try again
                                    </Button>
                                }
                            />
                        )}

                        {!loading && !error && visiblePosts.length === 0 && (
                            <EmptyState
                                title={search ? "No discussions match your search" : "No discussions yet"}
                                description={
                                    search
                                        ? "Try a different search term."
                                        : "Be the first to start a conversation with the community."
                                }
                            />
                        )}

                        {!loading && !error && visiblePosts.length > 0 && (
                            <div className="space-y-4">
                                {visiblePosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/90 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200/50"
                                    >
                                        <div className="flex gap-4">
                                            <Avatar className="h-11 w-11 border-2 border-white/90 shadow-sm">
                                                <AvatarFallback className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-gray-700">
                                                    {(post.author?.name || "Member")
                                                        .split(" ")
                                                        .map((n) => n[0] || "")
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                    <h3 className="font-semibold text-gray-800">{post.author?.name || "Member"}</h3>
                                                    {post.author.role && (
                                                        <span className="text-sm text-gray-500/80">• {post.author.role}</span>
                                                    )}
                                                    <span className="text-sm text-gray-400/80 ml-auto">
                                                        {timeAgo(post.createdAt)}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h2>
                                                <p className="text-gray-600/90 mb-3 whitespace-pre-line">{post.content}</p>

                                                {post.tags.length > 0 && (
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
                                                )}

                                                <div className="flex gap-3 mb-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleLike(post._id)}
                                                        className={`${post.likedByMe ? "text-pink-500" : "text-gray-600/90"} hover:text-pink-500/90 hover:bg-pink-50/50 transition-colors`}
                                                    >
                                                        <Heart
                                                            className={`h-4 w-4 mr-1.5 ${post.likedByMe ? "fill-current" : ""}`}
                                                        />
                                                        {post.likes}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600/90 hover:text-purple-500/90 hover:bg-purple-50/50 transition-colors"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-1.5" />
                                                        {post.comments.length}
                                                    </Button>
                                                </div>

                                                {/* Comments Section */}
                                                {post.comments.length > 0 && (
                                                    <div className="space-y-3 mb-3">
                                                        {post.comments.map((comment) => (
                                                            <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-semibold text-sm">
                                                                        {comment.author?.name || "Member"}
                                                                    </h4>
                                                                    <span className="text-xs text-gray-500">
                                                                        {timeAgo(comment.createdAt)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-700 text-sm">{comment.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Add Comment */}
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Add a comment..."
                                                        value={newComment[post._id] || ""}
                                                        onChange={(e) =>
                                                            setNewComment({
                                                                ...newComment,
                                                                [post._id]: e.target.value,
                                                            })
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleAddComment(post._id);
                                                        }}
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleAddComment(post._id)}
                                                        disabled={!newComment[post._id]}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Communities */}
                    <div className="space-y-5">
                        {/* Communities Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/90 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600/90" />
                                    Communities
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
                                {loading && <Loader inline size="sm" label="Loading communities..." />}

                                {!loading && !error && groups.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">
                                        No groups yet. Create one to get started.
                                    </p>
                                )}

                                {!loading &&
                                    groups.map((group) => (
                                        <div
                                            key={group._id}
                                            className="group bg-white/90 hover:bg-white border border-white/90 rounded-xl p-3.5 shadow-xs hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gradient-to-r from-purple-200/40 to-pink-200/40 p-2 rounded-lg group-hover:from-purple-300/40 group-hover:to-pink-300/40 transition-all">
                                                    <Users className="h-5 w-5 text-purple-600/80 group-hover:text-purple-700/80" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800 group-hover:text-purple-800/90 transition-colors">
                                                        {group.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500/80">
                                                        {group.participants.length.toLocaleString()} member
                                                        {group.participants.length === 1 ? "" : "s"}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => (window.location.href = "/group-chat")}
                                                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                                                >
                                                    Open
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
