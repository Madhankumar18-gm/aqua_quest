import React from 'react';
import { Droplets } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading AquaQuest...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin"></div>
        <Droplets className="w-6 h-6 text-teal-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
