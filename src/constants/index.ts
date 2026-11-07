import { Role } from '../types';

export const ROLES: Record<string, Role> = {
  LEAD: 'LEAD',
  CO_LEAD: 'CO_LEAD',
  SECRETARY: 'SECRETARY',
  TREASURER: 'TREASURER',
  TECHNICAL_DIVISION: 'TECHNICAL_DIVISION',
  NON_TECHNICAL_DIVISION: 'NON_TECHNICAL_DIVISION',
  MEMBER: 'MEMBER',
};

export const ROLE_LABELS: Record<Role, string> = {
  LEAD: 'Lead',
  CO_LEAD: 'Co-Lead',
  SECRETARY: 'Secretary',
  TREASURER: 'Treasurer',
  TECHNICAL_DIVISION: 'Technical Division',
  NON_TECHNICAL_DIVISION: 'Non-Technical Division',
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
  SECRETARY: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  TREASURER: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  TECHNICAL_DIVISION: {
    bg: 'bg-secondary-light',
    text: 'text-secondary-dark',
    border: 'border-secondary/20',
  },
  NON_TECHNICAL_DIVISION: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
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
