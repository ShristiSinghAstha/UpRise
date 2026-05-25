import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-6">
      <div className="relative flex items-center justify-center">
        {/* Decorative background glow */}
        <div className="absolute w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        {/* Spinner Icon */}
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide animate-pulse">
        Loading resources...
      </p>
    </div>
  );
};

export default LoadingSpinner;
