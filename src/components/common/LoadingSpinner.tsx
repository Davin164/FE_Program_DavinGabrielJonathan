import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4 gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {label && <p className="text-xs text-text-secondary font-medium">{label}</p>}
    </div>
  );
};
