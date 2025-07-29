"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface User {
  _id: string;
  // add any other user fields you need
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // fetch user on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://mentorher-backend.vercel.app/api/auth/user",
          { credentials: "include", cache: "no-store" }
        );
        const data = await res.json();
        if (data?._id) setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    })();
  }, []);

  // reset page loader on navigation
  useEffect(() => {
    if (isPageLoading) setIsPageLoading(false);
  }, [pathname]);

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
    setIsAuthLoading(true);
    try {
      await fetch(
        "https://mentorher-backend.vercel.app/api/auth/logout",
        { method: "POST", credentials: "include" }
      );
      setUser(null);
    } catch {
      /* ignore */
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <>
      {/* page‐loader overlay */}
      {isPageLoading && (
        <div className="
          fixed inset-x-0 top-16 bottom-0 z-40
          bg-white bg-opacity-60
          flex items-center justify-center
        ">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

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
                    Career Path Generator
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
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <button
                onClick={handleLogout}
                disabled={isAuthLoading}
                className="text-base font-medium text-gray-700 hover:text-purple-600"
              >
                {isAuthLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Logout"
                )}
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={handleNavClick}
                  className="flex items-center gap-1 text-base font-medium text-gray-700 hover:text-purple-600"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={handleNavClick}
                  className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            )}
          </div>

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
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Services submenu */}
              <button
                onClick={() => setIsDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:text-purple-600"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={18} />
                  Services
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="pl-8 flex flex-col space-y-1">
                  <Link
                    href="/Become-mentee"
                    onClick={handleNavClick}
                    className="py-1 text-gray-600 hover:text-purple-600"
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/BecomeMentor"
                    onClick={handleNavClick}
                    className="py-1 text-gray-600 hover:text-purple-600"
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/chatbot"
                    onClick={handleNavClick}
                    className="py-1 text-gray-600 hover:text-purple-600"
                  >
                    Career Path Generator
                  </Link>
                  {user && (
                    <Link
                      href={`/recommendations?userId=${user._id}`}
                      onClick={handleNavClick}
                      className="py-1 text-gray-600 hover:text-purple-600"
                    >
                      Recommend Mentors
                    </Link>
                  )}
                </div>
              )}

              {/* Community */}
              <Link
                href="/forum"
                onClick={handleNavClick}
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
              >
                <Users size={18} className="inline-block mr-2" />
                Community
              </Link>

              {/* Dashboard */}
              <Link
                href="/mentee-dashboard"
                onClick={handleNavClick}
                className="block px-3 py-2 text-gray-700 hover:text-purple-600"
              >
                <Calendar size={18} className="inline-block mr-2" />
                Dashboard
              </Link>

              {/* Auth */}
              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={isAuthLoading}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600"
                >
                  {isAuthLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={handleNavClick}
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600"
                  >
                    <LogIn size={18} className="inline-block mr-2" />
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={handleNavClick}
                    className="block px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-center"
                  >
                    <UserPlus size={18} className="inline-block mr-2" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
