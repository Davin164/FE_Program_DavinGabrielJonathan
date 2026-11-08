import React from 'react';
import { Role } from '../../types';
import { ROLE_LABELS } from '../../constants';
import { cn } from '../../lib/utils';
import { ShieldCheck, User, Award, FileText, Wallet, Code2 } from 'lucide-react';

interface RoleBadgeProps {
  role?: Role | string | null;
  className?: string;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className, showIcon = true }) => {
  const normalizedRole = (role?.toUpperCase() || 'MEMBER') as Role;

  const config: Record<Role, { label: string; bg: string; icon: React.ElementType }> = {
    LEAD: {
      label: ROLE_LABELS.LEAD,
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: ShieldCheck,
    },
    CO_LEAD: {
      label: ROLE_LABELS.CO_LEAD,
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Award,
    },
    SECRETARY_1: {
      label: ROLE_LABELS.SECRETARY_1,
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: FileText,
    },
    SECRETARY_2: {
      label: ROLE_LABELS.SECRETARY_2,
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: FileText,
    },
    TREASURER_1: {
      label: ROLE_LABELS.TREASURER_1,
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Wallet,
    },
    TREASURER_2: {
      label: ROLE_LABELS.TREASURER_2,
      bg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      icon: Wallet,
    },
    CORE_TEAM: {
      label: ROLE_LABELS.CORE_TEAM,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Code2,
    },
    MEMBER: {
      label: ROLE_LABELS.MEMBER,
      bg: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: User,
    },
  };

  const current = config[normalizedRole] || {
    label: normalizedRole,
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: User,
  };

  const IconComponent = current.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        current.bg,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5" />}
      {current.label}
    </span>
  );
};
