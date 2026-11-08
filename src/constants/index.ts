import { Role } from '../types';

export const ROLES: Record<string, Role> = {
  LEAD: 'LEAD',
  CO_LEAD: 'CO_LEAD',
  SECRETARY_1: 'SECRETARY_1',
  SECRETARY_2: 'SECRETARY_2',
  TREASURER_1: 'TREASURER_1',
  TREASURER_2: 'TREASURER_2',
  CORE_TEAM: 'CORE_TEAM',
  MEMBER: 'MEMBER',
};

export const ROLE_LABELS: Record<Role, string> = {
  LEAD: 'Lead',
  CO_LEAD: 'Co-Lead',
  SECRETARY_1: 'Secretary 1',
  SECRETARY_2: 'Secretary 2',
  TREASURER_1: 'Treasurer 1',
  TREASURER_2: 'Treasurer 2',
  CORE_TEAM: 'Core Team',
  MEMBER: 'Member',
};

export const ROLE_BADGE_STYLES: Record<Role, { bg: string; text: string; border: string }> = {
  LEAD: {
    bg: 'bg-primary-light',
    text: 'text-primary-dark',
    border: 'border-primary/20',
  },
  CO_LEAD: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  SECRETARY_1: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  SECRETARY_2: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  TREASURER_1: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  TREASURER_2: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  CORE_TEAM: {
    bg: 'bg-secondary-light',
    text: 'text-secondary-dark',
    border: 'border-secondary/20',
  },
  MEMBER: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  },
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};
