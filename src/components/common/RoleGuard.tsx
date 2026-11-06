import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-danger-light text-danger flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">403 - Access Restricted</h2>
        <p className="mt-2 text-sm text-text-secondary max-w-md">
          You do not have the required permissions to access this page. This section is restricted
          to: <span className="font-semibold">{allowedRoles.join(', ')}</span>.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-subtle transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
