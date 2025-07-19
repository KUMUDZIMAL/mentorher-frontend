import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}

const StatsCard = ({ icon: Icon, label, value, iconColor = 'text-purple-500' }: StatsCardProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className={`${iconColor} mr-2 sm:mr-3`}>
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </div>
        <span className="text-sm sm:text-base font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default StatsCard;