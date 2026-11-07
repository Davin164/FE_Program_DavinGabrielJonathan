import { Role } from '../types';

export const ROLES: Record<string, Role> = {
  LEAD: 'LEAD',
  DIVISION_HEAD: 'DIVISION_HEAD',
  MEMBER: 'MEMBER',
};

export const ROLE_LABELS: Record<Role, string> = {
  LEAD: 'Lead',
  DIVISION_HEAD: 'Division Head',
  MEMBER: 'Member',
};

export const ROLE_BADGE_STYLES: Record<Role, { bg: string; text: string; border: string }> = {
  LEAD: {
    bg: 'bg-primary-light',
    text: 'text-primary-dark',
    border: 'border-primary/20',
  },
  DIVISION_HEAD: {
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
