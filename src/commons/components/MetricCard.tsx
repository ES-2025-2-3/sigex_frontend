import React from 'react';
import { IconType } from 'react-icons';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  colorClass: 'amber' | 'blue' | 'emerald';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, colorClass }) => {
  const colors = {
    amber: "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-200/20",
    blue: "bg-blue-100 text-blue-700 border-blue-200 shadow-blue-200/20",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-200/20",
  };

  const dotColors = {
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
  };

  const selectedColor = colors[colorClass];
  const dotColor = dotColors[colorClass];

  return (
    <div className={`${selectedColor} p-6 rounded-2xl border-b flex items-center justify-between 
      transition-all duration-300 hover:shadow-md group relative overflow-hidden flex-1 min-w-[200px] font-inter`}>
      
      <div className="flex flex-col relative z-10">
        <span className="text-[0.75rem] font-medium uppercase tracking-wider opacity-80 mb-1">
          {label}
        </span>        
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-800">
            {value}
          </span>
          <div className={`h-2 w-2 rounded-full ${dotColor} opacity-75`}></div>
        </div>
      </div>

      <div className="bg-white/50 p-3 rounded-xl transition-transform duration-300">
        <Icon size={22} className="opacity-80" />
      </div>
    </div>
  );
};

export default MetricCard;