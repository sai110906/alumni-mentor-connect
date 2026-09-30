import React from 'react';

const Badge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
      case 'applied':
      case 'under_review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'interviewing':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'rejected':
      case 'inactive':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/30';
    }
  };

  const formatText = (text) => {
    if (!text) return 'Unknown';
    return text.replace('_', ' ').toUpperCase();
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wider uppercase inline-flex items-center gap-1 ${getStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {formatText(status)}
    </span>
  );
};

export default Badge;
