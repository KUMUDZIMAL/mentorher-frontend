"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface NotificationItem {
  _id: string;
  type: string;
  text: string;
  read: boolean;
  createdAt: string;
  actorId?: string;
  targetId: string;
}

interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
}

const POLL_MS = 30000;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function hrefFor(n: NotificationItem): string {
  switch (n.type) {
    case "session_request.created":
      return "/mentor-dashboard";
    case "session_request.updated":
      return "/mentee-dashboard";
    case "dm.created":
      return n.actorId ? `/chat/${n.actorId}` : "/messages";
    case "group_message.created":
      return "/group-chat";
    default:
      return "/";
  }
}

/**
 * Navbar notification bell: polls GET /api/notifications every 30s while
 * authenticated, shows an unread badge, and lets the user open/mark read.
 */
export default function NotificationBell() {
  const { status } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<NotificationsResponse>("/api/notifications");
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
    } catch (err) {
      // Logged out (401) or backend unreachable (0): stop polling quietly.
      if (err instanceof ApiError && (err.status === 401 || err.status === 0)) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setItems([]);
        setUnread(0);
      }
      // Transient errors keep the last known state; the next tick retries.
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    void load();
    timerRef.current = setInterval(() => void load(), POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [status, load]);

  // Close the panel on outside click.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const applyRead = useCallback((ids?: string[]) => {
    setItems((prev) => {
      const next = prev.map((n) =>
        !n.read && (!ids || ids.includes(n._id)) ? { ...n, read: true } : n
      );
      setUnread(next.filter((n) => !n.read).length);
      return next;
    });
  }, []);

  const markRead = useCallback(
    async (ids?: string[]) => {
      applyRead(ids);
      try {
        await apiFetch("/api/notifications/read", {
          method: "POST",
          body: ids ? { ids } : {},
        });
      } catch {
        void load(); // resync with the server
      }
    },
    [applyRead, load]
  );

  const onItemClick = (n: NotificationItem) => {
    setOpen(false);
    if (!n.read) void markRead([n._id]);
    router.push(hrefFor(n));
  };

  if (status !== "authenticated") return null;

  const badge = unread > 9 ? "9+" : unread > 0 ? String(unread) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
        className="relative flex items-center text-gray-700 hover:text-purple-600 p-1"
      >
        <Bell size={20} />
        {badge && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
            {badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 flex flex-col bg-white shadow-xl rounded-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => void markRead()}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet</p>
            ) : (
              items.map((n) => (
                <button
                  key={n._id}
                  onClick={() => onItemClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${
                    n.read ? "" : "bg-purple-50/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 w-2 h-2 flex-shrink-0 rounded-full bg-purple-500" />
                    )}
                    <div className={n.read ? "pl-4" : ""}>
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
