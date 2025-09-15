
import React from 'react';
import { Refresh } from './Icons';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  onReset?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit, onReset }) => {
  return (
    <div className="relative p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 flex flex-col justify-between">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <p className="text-sm text-cyan-200">{label}</p>
        </div>
      </div>
      <div className="text-right mt-4">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="ml-1 text-cyan-400">{unit}</span>
      </div>
      {onReset && (
        <button 
          onClick={onReset} 
          className="absolute top-2 right-2 p-1 text-cyan-500 hover:text-white hover:bg-cyan-500/20 rounded-full transition-colors"
          aria-label={`Reset ${label}`}
        >
          <Refresh className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default StatCard;
