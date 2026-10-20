import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Consistent "no data yet" state shown instead of fake/default data.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 ${className}`}
  >
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100/70">
      <Icon className="h-6 w-6 text-purple-500" />
    </div>
    <p className="text-sm sm:text-base font-semibold text-gray-700">{title}</p>
    {description && <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
