import React from 'react';
import { Role } from '../../types';
import { ROLE_LABELS } from '../../constants';
import { cn } from '../../lib/utils';
import { ShieldCheck, UserCheck, User } from 'lucide-react';

interface RoleBadgeProps {
  role?: Role | string | null;
  className?: string;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className, showIcon = true }) => {
  const normalizedRole = (role?.toUpperCase() || 'MEMBER') as Role;

  const config = {
    LEAD: {
      label: ROLE_LABELS.LEAD,
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: ShieldCheck,
    },
    DIVISION_HEAD: {
      label: ROLE_LABELS.DIVISION_HEAD,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: UserCheck,
    },
    MEMBER: {
      label: ROLE_LABELS.MEMBER,
      bg: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: User,
    },
  }[normalizedRole] || {
    label: normalizedRole,
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: User,
  };

  const IconComponent = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.bg,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
};
