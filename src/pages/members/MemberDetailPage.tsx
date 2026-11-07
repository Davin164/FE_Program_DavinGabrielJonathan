import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMember } from '../../hooks/useMembers';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { RoleBadge } from '../../components/common/RoleBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Mail, Phone, CreditCard, Calendar, Edit2, Shield, FolderGit2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading, error } = useMember(id);
  const { role: currentUserRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading member profile..." />;
  }

  if (error || !member) {
    return (
      <div className="py-12">
        <EmptyState
          title="Member not found"
          description="The requested member profile does not exist or has been removed."
          action={{
            label: 'Back to Members',
            onClick: () => window.history.back(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.name}
        description={`Member profile details and chapter credentials`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Members', href: '/members' },
          { label: member.name },
        ]}
        showBackButton
        backHref="/members"
        actions={
          (currentUserRole === 'LEAD' || currentUserRole === 'CO_LEAD') && (
            <Link
              to={`/members/${member.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-subtle transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary-light text-primary font-bold text-2xl flex items-center justify-center mb-4 shadow-subtle">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-text-primary">{member.name}</h2>
          <p className="text-xs text-text-secondary mt-0.5">{member.email}</p>

          <div className="mt-3">
            <RoleBadge role={member.role} />
          </div>

          <div className="mt-6 w-full pt-4 border-t border-border flex justify-between text-xs text-text-secondary">
            <span>Joined on</span>
            <span className="font-medium text-text-primary">{formatDate(member.created_at)}</span>
          </div>
        </div>

        {/* Member Details */}
        <div className="md:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-subtle">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Academic & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">Email Address</span>
                <span className="text-sm font-medium text-text-primary break-all">
                  {member.email}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">WhatsApp Phone</span>
                <span className="text-sm font-medium text-text-primary">
                  {member.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <CreditCard className="w-5 h-5 text-warning-dark shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">NIM (Student ID)</span>
                <span className="text-sm font-medium font-mono text-text-primary">
                  {member.nim || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <FolderGit2 className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">Division</span>
                <span className="text-sm font-medium text-text-primary">
                  {member.division_name || 'General Member'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">System Role</span>
                <span className="text-sm font-medium text-text-primary">{member.role}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-border/50">
              <Calendar className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-text-secondary block">Account Created</span>
                <span className="text-sm font-medium text-text-primary">
                  {formatDate(member.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
