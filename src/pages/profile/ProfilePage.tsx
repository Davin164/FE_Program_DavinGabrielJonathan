import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateMember } from '../../hooks/useMembers';
import { PageHeader } from '../../components/common/PageHeader';
import { ProfileForm, ProfileFormData } from '../../components/forms/ProfileForm';
import { RoleBadge } from '../../components/common/RoleBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../lib/utils';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, refetchUser } = useAuth();
  const updateMemberMutation = useUpdateMember();

  if (!user) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading profile..." />;
  }

  const handleSubmit = async (formData: ProfileFormData) => {
    const updated = await updateMemberMutation.mutateAsync({
      id: user.id,
      data: {
        name: formData.name,
        nim: formData.nim || undefined,
        phone: formData.phone || undefined,
      },
    });

    if (updated) {
      updateUser(updated);
    }
    await refetchUser();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="My Profile"
        description="Manage your account preferences and personal credentials."
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
      <ProfileForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={updateMemberMutation.isPending}
      />
    </div>
  );
};
