import React from 'react';

const LoadingSpinner = ({ message = 'Loading details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-400 mt-4">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
