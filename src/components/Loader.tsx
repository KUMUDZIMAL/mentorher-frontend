import React from "react";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  /** Renders the loader centered in a full-screen overlay. */
  fullPage?: boolean;
  /** Removes the default vertical padding (for inline/compact use). */
  inline?: boolean;
  size?: LoaderSize;
  /** Optional caption shown next to / under the spinner. */
  label?: string;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-16 w-16 border-4",
};

/**
 * The single MentorHer loading indicator. Use it everywhere data is being
 * loaded (auth checks, dashboards, profiles, API/MongoDB requests).
 */
const Loader: React.FC<LoaderProps> = ({ fullPage = false, inline = false, size = "md", label, className = "" }) => {
  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-purple-300 border-t-pink-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-sm sm:text-base text-gray-600 font-medium">{label}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${inline ? "" : "py-12 px-4"} ${className}`}>
      {spinner}
    </div>
  );
};

export default Loader;
