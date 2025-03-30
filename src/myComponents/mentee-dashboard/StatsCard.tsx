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
    <div className="card-stats">
      <div className="flex items-center">
        <div className={`${iconColor} mr-2`}>
          <Icon size={20} />
        </div>
        <span className="stats-label">{label}</span>
      </div>
      <div className="stats-value">{value}</div>
    </div>
  );
};

export default StatsCard;