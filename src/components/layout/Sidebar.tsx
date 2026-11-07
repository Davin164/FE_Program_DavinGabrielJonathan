import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  UserCircle,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RoleBadge } from '../common/RoleBadge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Members',
    href: '/members',
    icon: Users,
  },
  {
    name: 'Events',
    href: '/events',
    icon: Calendar,
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: ClipboardCheck,
  },
  {
    name: 'My Profile',
    href: '/profile',
    icon: UserCircle,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-surface border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <img src="/LogoGDG.webp" alt="GDGoC Logo" className="w-9 h-9 rounded-xl object-cover shadow-subtle" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-text-primary leading-none">
                GDGoC UNSRI
              </span>
              <span className="text-[10px] text-text-secondary mt-1 font-medium">
                Management System
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-secondary rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 mx-3 my-3 bg-gray-50 rounded-xl border border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
              <div className="mt-1">
                <RoleBadge role={user?.role} showIcon={false} className="text-[10px] px-1.5 py-0" />
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-danger hover:bg-danger-light rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
