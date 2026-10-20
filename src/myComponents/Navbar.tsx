"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  LogIn,
  UserPlus,
  ChevronDown,
  Calendar,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import Loader from "@/components/Loader";
import { useAuth } from "@/lib/AuthContext";
import NotificationBell from "@/myComponents/NotificationBell";

export default function Navbar() {
  const { status: authStatus, user, logout } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // reset page loader on navigation
  useEffect(() => {
    if (isPageLoading) setIsPageLoading(false);
  }, [pathname, isPageLoading]);

  // close dropdowns on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleNavClick = () => {
    setIsPageLoading(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * AUTH_LOADING -> Loader, AUTHENTICATED -> Logout, UNAUTHENTICATED -> Login/Register.
   * Login/Register are never rendered while the auth check is in progress.
   */
  const renderAuthActions = (mobile = false) => {
    if (authStatus === "loading") {
      return (
        <span
          className={`flex items-center ${mobile ? "px-3 py-2" : ""}`}
          aria-label="Checking authentication"
        >
          <Loader size="sm" inline />
        </span>
      );
    }

    if (authStatus === "authenticated") {
      return (
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`${
            mobile
              ? "text-gray-700 hover:text-purple-600 px-3 py-2 rounded w-full text-left"
              : "text-base font-medium text-gray-700 hover:text-purple-600"
          }`}
        >
          {isLoggingOut ? (
            <Loader size="sm" inline label={mobile ? "Logging out..." : undefined} />
          ) : (
            "Logout"
          )}
        </button>
      );
    }

    return (
      <>
        <Link
          href="/auth/login"
          onClick={handleNavClick}
          className={
            mobile
              ? "flex items-center gap-1 text-gray-700 hover:text-purple-600 px-3 py-2 rounded"
              : "flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
          }
        >
          <LogIn size={18} />
          Login
        </Link>
        <Link
          href="/auth/register"
          onClick={handleNavClick}
          className={
            mobile
              ? "flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full w-fit"
              : "flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full"
          }
        >
          <UserPlus size={18} />
          Register
        </Link>
      </>
    );
  };

  return (
    <>
      {/* page‐loader overlay */}
      {isPageLoading && <Loader fullPage size="lg" label="Loading page..." />}

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-purple-600"
          >
            <Home size={20} />
            MentorHer
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Services dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
              >
                <BookOpen size={18} />
                Services
                <ChevronDown size={16} />
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white shadow-lg rounded-lg py-2 w-48 border border-gray-100">
                  <Link
                    href="/Become-mentee"
                    onClick={handleNavClick}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/BecomeMentor"
                    onClick={handleNavClick}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/chatbot"
                    onClick={handleNavClick}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Career Roadmap
                  </Link>
                  {user && (
                    <Link
                      href={`/recommendations?userId=${user._id}`}
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Recommend Mentors
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/room"
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Video Call
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/forum"
              onClick={handleNavClick}
              className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
            >
              <Users size={18} />
              Community
            </Link>

            {user && (
              <Link
                href="/messages"
                onClick={handleNavClick}
                className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
              >
                <MessageSquare size={18} />
                Messages
              </Link>
            )}

            {user && <NotificationBell />}

            <Link
              href="/mentee-dashboard"
              onClick={handleNavClick}
              className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
            >
              <Calendar size={18} />
              Dashboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-6">{renderAuthActions()}</div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t bg-white/95 backdrop-blur-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Services section */}
              <div>
                <p className="flex items-center gap-1 font-medium text-gray-700">
                  <BookOpen size={18} />
                  Services
                </p>
                <div className="ml-6 mt-1 space-y-1">
                  <Link
                    href="/Become-mentee"
                    onClick={handleNavClick}
                    className="block text-gray-700 hover:text-gray-100 px-3 py-1 rounded"
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/BecomeMentor"
                    onClick={handleNavClick}
                    className="block text-gray-700 hover:text-gray-100 px-3 py-1 rounded"
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/chatbot"
                    onClick={handleNavClick}
                    className="block text-gray-700 hover:text-gray-100 px-3 py-1 rounded"
                  >
                    Career Roadmap
                  </Link>
                  {user && (
                    <Link
                      href={`/recommendations?userId=${user._id}`}
                      onClick={handleNavClick}
                      className="block text-gray-700 hover:text-gray-100 px-3 py-1 rounded"
                    >
                      Recommend Mentors
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/room"
                      onClick={handleNavClick}
                      className="block text-gray-700 hover:text-gray-100 px-3 py-1 rounded"
                    >
                      Video Call
                    </Link>
                  )}
                </div>
              </div>

              {/* Other links */}
              <Link
                href="/forum"
                onClick={handleNavClick}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-100 px-3 py-2 rounded"
              >
                <Users size={18} />
                Community
              </Link>

              {user && (
                <Link
                  href="/messages"
                  onClick={handleNavClick}
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-100 px-3 py-2 rounded"
                >
                  <MessageSquare size={18} />
                  Messages
                </Link>
              )}

              {user && (
                <div className="flex items-center gap-1 text-gray-700 px-3 py-2 rounded">
                  <NotificationBell />
                  <span className="text-base font-medium text-gray-700">Notifications</span>
                </div>
              )}

              <Link
                href="/mentee-dashboard"
                onClick={handleNavClick}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-100 px-3 py-2 rounded"
              >
                <Calendar size={18} />
                Dashboard
              </Link>

              {/* Auth buttons */}
              <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                {renderAuthActions(true)}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
