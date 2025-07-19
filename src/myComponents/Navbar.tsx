"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Home, BookOpen, Users, LogIn, UserPlus, ChevronDown, Calendar, Menu, X } from "lucide-react";

// Define a User interface to type the fetched user object.
interface User {
  _id: string;
  // Add additional properties as needed.
}

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Specify that the dropdownRef is a reference to an HTMLDivElement.
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://mentorher-backend.vercel.app/api/auth/user", { cache: "no-store", credentials: "include" });
        const data = await res.json();
        console.log("Fetched auth data:", data);

        // Check if the fetched data has an _id property.
        if (data && data._id) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle logout.
  const handleLogout = async () => {
    try {
      const res = await fetch("https://mentorher-backend.vercel.app/api/auth/logout", { method: "POST", credentials: "include" });
      if (res.ok) {
        setUser(null);
        setIsMobileMenuOpen(false);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2 text-lg font-semibold"
            >
              <Home size={20} />
              <span className="hidden sm:inline">MentorHer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2 text-base font-medium"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <BookOpen size={18} />
                <span>Services</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute mt-2 bg-white shadow-lg rounded-lg py-2 w-48 border border-gray-100">
                  <Link
                    href="/Become-mentee"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/BecomeMentor"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/chatbot"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Career Path Generator
                  </Link>
                  {user && (
                    <Link
                      href={`/recommendations?userId=${user._id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Recommend mentors
                    </Link>
                  )}
                  {user && (
                    <Link
                      href={`/room`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Video Call
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/forum"
              className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2 text-base font-medium"
            >
              <Users size={18} />
              <span>Community</span>
            </Link>

            <Link
              href="/mentee-dashboard"
              className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2 text-base font-medium"
            >
              <Calendar size={18} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Desktop Auth Options */}
          <div className="hidden md:flex items-center space-x-6">
            {!isLoading &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-base font-medium"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-2 text-base font-medium"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-base font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Services Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Services
                </div>
                <div className="space-y-1">
                  <Link
                    href="/Become-mentee"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Mentee
                  </Link>
                  <Link
                    href="/BecomeMentor"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Mentor
                  </Link>
                  <Link
                    href="/chatbot"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Career Path Generator
                  </Link>
                  {user && (
                    <Link
                      href={`/recommendations?userId=${user._id}`}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Recommend mentors
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/room"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Video Call
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/forum"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  Community
                </span>
              </Link>

              <Link
                href="/mentee-dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  Dashboard
                </span>
              </Link>

              {/* Mobile Auth Options */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {!isLoading &&
                  (user ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <LogIn size={18} />
                          Login
                        </span>
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md transition-opacity hover:opacity-90"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <UserPlus size={18} />
                          Register
                        </span>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
