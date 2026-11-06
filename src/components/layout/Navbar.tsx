import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RoleBadge } from '../common/RoleBadge';
import { Link } from 'react-router-dom';
import { getInitials } from '../../lib/utils';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface/90 backdrop-blur-md border-b border-border">
      {/* Left side: hamburger button + brand tagline */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary-light text-primary uppercase tracking-wider">
            Chapter UNSRI
          </span>
        </div>
      </div>

      {/* Right side: user profile dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full sm:rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-text-primary leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[11px] text-text-secondary">
                {user?.email || ''}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-card border border-border py-2 animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-secondary truncate mt-0.5">{user?.email}</p>
                <div className="mt-2">
                  <RoleBadge role={user?.role} className="text-[11px]" />
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-primary hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-text-secondary" />
                  <span>My Profile</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-danger hover:bg-danger-light transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
