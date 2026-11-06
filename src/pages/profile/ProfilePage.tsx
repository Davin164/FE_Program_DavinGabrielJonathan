import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { ProfileForm, ProfileFormData } from '../../components/forms/ProfileForm';
import { RoleBadge } from '../../components/common/RoleBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import api from '../../lib/axios';
import { toast } from 'sonner';
import { getErrorMessage, formatDate } from '../../lib/utils';
import { ApiResponse, User } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading profile..." />;
  }

  const handleSubmit = async (formData: ProfileFormData) => {
    setIsLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        nim: formData.nim || undefined,
        phone: formData.phone || undefined,
      };

      if (formData.new_password) {
        payload.current_password = formData.current_password;
        payload.new_password = formData.new_password;
      }

      const res = await api.put<ApiResponse<User>>('/profile', payload);
      const updated = res.data.data || {
        ...user,
        name: formData.name,
        nim: formData.nim,
        phone: formData.phone,
      };

      updateUser(updated);
      await refetchUser();
      toast.success('Your profile has been updated successfully!');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="My Profile"
        description="Manage your account preferences, personal credentials, and password."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Profile' },
        ]}
      />

      {/* Account Overview Header */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary-light text-primary font-bold text-2xl flex items-center justify-center shadow-subtle shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
            <RoleBadge role={user.role} />
          </div>
          <p className="text-xs text-text-secondary">{user.email}</p>
          <p className="text-xs text-text-secondary">
            Member of GDGoC UNSRI since {formatDate(user.created_at)}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <ProfileForm user={user} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};
