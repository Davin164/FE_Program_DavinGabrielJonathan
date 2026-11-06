import React from 'react';
import { cn } from '../../lib/utils';

export type StatusType = 'upcoming' | 'ongoing' | 'past' | 'open' | 'closed' | 'full';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const norm = status.toLowerCase();

  const styles: Record<string, { bg: string; dot: string; defaultLabel: string }> = {
    upcoming: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      defaultLabel: 'Upcoming',
    },
    ongoing: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
      defaultLabel: 'Live Now',
    },
    open: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      defaultLabel: 'Open',
    },
    full: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      defaultLabel: 'Full Quota',
    },
    past: {
      bg: 'bg-gray-100 text-gray-600 border-gray-200',
      dot: 'bg-gray-400',
      defaultLabel: 'Past Event',
    },
    closed: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      defaultLabel: 'Closed',
    },
  };

  const current = styles[norm] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    defaultLabel: status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        current.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', current.dot)} />
      {label || current.defaultLabel}
    </span>
  );
};
