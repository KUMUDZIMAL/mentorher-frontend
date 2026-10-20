"use client";

import React, { useCallback, useEffect, useMemo, useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Clock,
  GraduationCap,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Calendar,
  Users,
  RotateCcw,
  MessageSquareQuote,
  BookOpen,
  Flag,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/myComponents/Navbar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch, errorMessage } from "@/lib/api";

// ---------- types ----------

interface MentorLite {
  _id: string;
  fullName: string;
  currentRole?: string;
  company?: string;
  profilePhoto?: string;
}

interface Phase {
  title: string;
  duration: string;
  goal: string;
  skills: string[];
  resources: { name: string; type: string; url: string }[];
  project: string;
  milestone: string;
  mentors: MentorLite[];
}

interface Roadmap {
  targetRole: string;
  summary: string;
  skillGaps: string[];
  phases: Phase[];
  roles: string[];
  interviewFocus: string[];
  events: { _id: string; title: string; date: string; time: string; category: string; location: string }[];
  completedPhases: number[];
}

// ---------- constants ----------

const STATUS_OPTIONS = ["Student", "Working professional", "Career switcher", "Job seeker"];

const ROLE_OPTIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "AI/ML Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Product Manager",
  "UI/UX Designer",
  "QA Engineer",
  "Digital Marketing Manager",
  "Business Analyst",
  "Financial Analyst",
  "HR & People Ops",
  "Sales Manager",
  "Content Creator",
  "Other",
];

const HOURS_OPTIONS = ["Less than 5 hours", "5-10 hours", "10-20 hours", "20+ hours"];

const SKILL_CHIPS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "AI/ML",
  "Data Analysis",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "UI/UX",
  "Communication",
  "Digital Marketing",
  "Business Analysis",
  "Finance",
  "Sales",
  "Content Writing",
];

const GENERATING_LABELS = [
  "Analyzing your profile…",
  "Mapping skill gaps…",
  "Building your phases…",
  "Matching mentors…",
  "Finding events…",
];

// ---------- small components ----------

const Chip: React.FC<{
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ label, active, onClick }) =>
  onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-white text-violet-700 border-violet-300 hover:bg-violet-50"
      }`}
    >
      {label}
    </button>
  ) : (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
      {label}
    </span>
  );

const MentorCard: React.FC<{ mentor: MentorLite }> = ({ mentor }) => (
  <Link
    href={`/profile/mentor/${mentor._id}`}
    className="flex items-center gap-3 p-2.5 rounded-lg border bg-white hover:shadow-md transition-all"
  >
    {mentor.profilePhoto ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mentor.profilePhoto}
        alt={mentor.fullName}
        className="w-9 h-9 rounded-full object-cover"
      />
    ) : (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold">
        {(mentor.fullName || "M").charAt(0).toUpperCase()}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-sm font-medium truncate">{mentor.fullName}</p>
      <p className="text-xs text-muted-foreground truncate">
        {[mentor.currentRole, mentor.company].filter(Boolean).join(" · ") || "Mentor"}
      </p>
    </div>
  </Link>
);

// ---------- page ----------

export default function CareerRoadmapPage() {
  const { status: authStatus } = useAuth();

  // page lifecycle
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [view, setView] = useState<"form" | "generating" | "result">("form");
  const [error, setError] = useState("");
  const [genError, setGenError] = useState("");

  // form state
  const [currentStatus, setCurrentStatus] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [challenges, setChallenges] = useState("");

  // result state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [savingProgress, setSavingProgress] = useState(false);

  // rotating label while generating
  const [labelIdx, setLabelIdx] = useState(0);
  useEffect(() => {
    if (view !== "generating") return;
    const id = setInterval(() => setLabelIdx((i) => (i + 1) % GENERATING_LABELS.length), 1800);
    return () => clearInterval(id);
  }, [view]);

  // On mount: load saved roadmap + optional mentee prefill (when logged in)
  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus !== "authenticated") {
      setCheckingSaved(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const saved = await apiFetch<{ roadmap: any }>("/api/career-path");
        if (cancelled) return;
        if (saved.roadmap) {
          setRoadmap(saved.roadmap);
          setView("result");
        }
      } catch {
        /* no saved roadmap — stay on form */
      }
      try {
        const md = await apiFetch<{ data: any }>("/api/auth/menteedata");
        if (!cancelled && md.data) {
          setEducation((prev) => prev || md.data.education || "");
          if (Array.isArray(md.data.technicalSkills) && md.data.technicalSkills.length) {
            setSkills((prev) => (prev.length ? prev : md.data.technicalSkills));
          }
        }
      } catch {
        /* no mentee profile — manual form is fine */
      } finally {
        if (!cancelled) setCheckingSaved(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  const toggleSkill = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setCustomSkill("");
  };

  const effectiveRole = targetRole === "Other" ? customRole.trim() : targetRole;

  const formValid =
    Boolean(currentStatus && effectiveRole && hoursPerWeek) &&
    (targetRole !== "Other" || customRole.trim().length > 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setGenError("");
    setView("generating");
    setLabelIdx(0);
    try {
      const res = await apiFetch<{ roadmap: Roadmap }>("/api/career-path", {
        method: "POST",
        body: {
          targetRole: effectiveRole,
          currentStatus,
          education,
          skills,
          hoursPerWeek,
          challenges,
        },
      });
      setRoadmap(res.roadmap);
      setView("result");
    } catch (err) {
      setGenError(errorMessage(err));
      setView("form");
    }
  };

  const togglePhase = useCallback(
    async (index: number) => {
      if (!roadmap) return;
      const done = roadmap.completedPhases.includes(index)
        ? roadmap.completedPhases.filter((i) => i !== index)
        : [...roadmap.completedPhases, index];
      setRoadmap({ ...roadmap, completedPhases: done });
      setSavingProgress(true);
      try {
        await apiFetch("/api/career-path", {
          method: "PATCH",
          body: { completedPhases: done },
        });
      } catch {
        /* keep optimistic state; user can re-toggle */
      } finally {
        setSavingProgress(false);
      }
    },
    [roadmap]
  );

  const startOver = () => {
    setRoadmap(null);
    setView("form");
    setGenError("");
    setError("");
  };

  const completedCount = roadmap?.completedPhases.length ?? 0;
  const totalCount = roadmap?.phases.length ?? 0;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalDuration = useMemo(
    () => roadmap?.phases.map((p) => p.duration).filter(Boolean).join(" + ") ?? "",
    [roadmap]
  );

  // ---------- gates & loaders ----------

  if (authStatus === "loading" || checkingSaved) {
    return <Loader fullPage size="lg" label="Loading..." />;
  }

  if (authStatus !== "authenticated") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-3">Please log in first</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Log in to build your personalized career roadmap — saved automatically so you
          can track progress anytime.
        </p>
        <Link href="/auth/login">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 mb-3">
              <Sparkles size={14} /> AI Career Roadmap
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Your Personalized{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Career Roadmap
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Answer a few questions — get a phased plan with skills, resources, projects,
              mentors and events from our community.
            </p>
          </div>

          {view === "generating" && (
            <Loader size="lg" label={GENERATING_LABELS[labelIdx]} />
          )}

          {view === "form" && (
            <>
              {genError && (
                <div className="mb-6">
                  <EmptyState
                    icon={AlertTriangle}
                    title="Could not generate roadmap"
                    description={genError}
                    action={
                      <Button
                        onClick={handleSubmit as any}
                        className="bg-violet-600 text-white hover:bg-violet-700"
                      >
                        Try again
                      </Button>
                    }
                  />
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/80 backdrop-blur-md border rounded-2xl p-6 sm:p-8 shadow-lg"
              >
                {/* current status */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <Target size={16} className="text-violet-600" /> Where are you right now?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <Chip key={s} label={s} active={currentStatus === s} onClick={() => setCurrentStatus(s)} />
                    ))}
                  </div>
                </div>

                {/* education */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-2">
                    <GraduationCap size={16} className="text-violet-600" /> Education
                  </label>
                  <Input
                    value={education}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEducation(e.target.value)}
                    placeholder="e.g. B.Tech CSE, 3rd year"
                  />
                </div>

                {/* skills */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <Wrench size={16} className="text-violet-600" /> Your current skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SKILL_CHIPS.map((s) => (
                      <Chip key={s} label={s} active={skills.includes(s)} onClick={() => toggleSkill(s)} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSkill();
                        }
                      }}
                      placeholder="Add another skill + Enter"
                    />
                    <Button type="button" variant="outline" onClick={addCustomSkill}>
                      Add
                    </Button>
                  </div>
                </div>

                {/* target role */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <Sparkles size={16} className="text-violet-600" /> Target role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <Chip key={r} label={r} active={targetRole === r} onClick={() => setTargetRole(r)} />
                    ))}
                  </div>
                  {targetRole === "Other" && (
                    <Input
                      className="mt-3"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Type your target role"
                    />
                  )}
                </div>

                {/* hours */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-3">
                    <Clock size={16} className="text-violet-600" /> Time you can invest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HOURS_OPTIONS.map((h) => (
                      <Chip key={h} label={h} active={hoursPerWeek === h} onClick={() => setHoursPerWeek(h)} />
                    ))}
                  </div>
                </div>

                {/* challenges */}
                <div>
                  <label className="flex items-center gap-2 font-medium mb-2">
                    <MessageSquareQuote size={16} className="text-violet-600" /> Challenges or concerns{" "}
                    <span className="text-muted-foreground font-normal text-sm">(optional)</span>
                  </label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    rows={3}
                    placeholder="e.g. I get stuck on DSA, or unsure how to start with AI…"
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                  type="submit"
                  disabled={!formValid}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Sparkles size={16} className="mr-2" />
                  Generate My Roadmap
                </Button>
                {!formValid && (
                  <p className="text-xs text-muted-foreground text-center">
                    Status, target role aur time select karke generate karein.
                  </p>
                )}
              </form>
            </>
          )}

          {view === "result" && roadmap && (
            <div className="space-y-8">
              {/* summary card */}
              <div className="bg-white border rounded-2xl p-6 shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-2xl font-bold">{roadmap.targetRole}</h2>
                    {totalDuration && (
                      <p className="text-sm text-muted-foreground mt-1">Est. timeline: {totalDuration}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={startOver}>
                      <RotateCcw size={14} className="mr-1.5" /> Start over
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit as any}
                      className="bg-violet-600 text-white hover:bg-violet-700"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
                {roadmap.summary && <p className="text-sm leading-relaxed">{roadmap.summary}</p>}

                {/* progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>
                      Progress: {completedCount}/{totalCount} phases
                      {savingProgress ? " (saving…)" : ""}
                    </span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* skill gaps + roles */}
                {(roadmap.skillGaps.length > 0 || roadmap.roles.length > 0) && (
                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    {roadmap.skillGaps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Skill gaps
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {roadmap.skillGaps.map((g, i) => (
                            <Chip key={i} label={g} />
                          ))}
                        </div>
                      </div>
                    )}
                    {roadmap.roles.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Roles this leads to
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {roadmap.roles.map((r, i) => (
                            <Chip key={i} label={r} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* timeline */}
              <div className="relative pl-6 sm:pl-8">
                <div className="absolute left-2 sm:left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-violet-400 to-pink-300" />
                {roadmap.phases.map((phase, idx) => {
                  const done = roadmap.completedPhases.includes(idx);
                  return (
                    <div key={idx} className="relative mb-6">
                      <div
                        className={`absolute -left-5 sm:-left-6 top-4 w-5 h-5 rounded-full border-2 border-white shadow flex items-center justify-center ${
                          done ? "bg-green-500" : "bg-violet-500"
                        }`}
                      >
                        {done ? <CheckCircle2 size={12} className="text-white" /> : null}
                      </div>

                      <div
                        className={`bg-white border rounded-xl p-5 shadow-md transition-all ${
                          done ? "opacity-80 border-green-200" : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {idx + 1}. {phase.title}
                            </h3>
                            {phase.duration && (
                              <span className="inline-flex items-center gap-1 text-xs text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full mt-1">
                                <Clock size={11} /> {phase.duration}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => togglePhase(idx)}
                            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-violet-700"
                          >
                            {done ? (
                              <CheckCircle2 size={18} className="text-green-600" />
                            ) : (
                              <Circle size={18} />
                            )}
                            {done ? "Completed" : "Mark complete"}
                          </button>
                        </div>

                        {phase.goal && <p className="text-sm mt-2">{phase.goal}</p>}

                        {phase.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {phase.skills.map((s, i) => (
                              <Chip key={i} label={s} />
                            ))}
                          </div>
                        )}

                        {phase.resources.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 flex items-center gap-1">
                              <BookOpen size={12} /> Resources
                            </p>
                            <ul className="space-y-1">
                              {phase.resources.map((r, i) => (
                                <li key={i} className="text-sm">
                                  {r.url ? (
                                    <a
                                      href={r.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-violet-700 hover:underline inline-flex items-center gap-1"
                                    >
                                      {r.name} <ExternalLink size={11} />
                                    </a>
                                  ) : (
                                    <span>{r.name}</span>
                                  )}
                                  <span className="text-xs text-muted-foreground ml-1.5">
                                    ({r.type})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.project && (
                          <p className="text-sm mt-3 flex gap-2">
                            <Flag size={14} className="text-pink-500 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Project:</span> {phase.project}
                            </span>
                          </p>
                        )}
                        {phase.milestone && (
                          <p className="text-sm mt-1.5 flex gap-2">
                            <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-medium">Milestone:</span> {phase.milestone}
                            </span>
                          </p>
                        )}

                        {phase.mentors.length > 0 && (
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                              <Users size={12} /> Mentors for this phase
                            </p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {phase.mentors.map((m) => (
                                <MentorCard key={m._id} mentor={m} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* interview focus */}
              {roadmap.interviewFocus.length > 0 && (
                <div className="bg-white border rounded-2xl p-6 shadow">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target size={16} className="text-violet-600" /> Interview focus
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {roadmap.interviewFocus.map((t, i) => (
                      <Chip key={i} label={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* events */}
              {roadmap.events.length > 0 && (
                <div className="bg-white border rounded-2xl p-6 shadow">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-violet-600" /> Upcoming events for you
                  </h3>
                  <ul className="space-y-2">
                    {roadmap.events.map((ev) => (
                      <li
                        key={ev._id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium text-sm">{ev.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {ev.date} · {ev.time} · {ev.location || ev.category}
                          </p>
                        </div>
                        <Link href="/#events">
                          <Button variant="outline" size="sm">
                            View & register
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="text-center">
                <Link href="/find-mentor">
                  <Button className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 text-white shadow-md">
                    <Users size={16} className="mr-2" /> Explore all mentors
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
