import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records matching your request at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
