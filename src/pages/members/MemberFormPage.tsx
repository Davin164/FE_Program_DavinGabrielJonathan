import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMember, useCreateMember, useUpdateMember } from '../../hooks/useMembers';
import { PageHeader } from '../../components/common/PageHeader';
import { MemberForm, MemberFormData } from '../../components/forms/MemberForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const MemberFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: member, isLoading: isMemberLoading } = useMember(id);
  const createMemberMutation = useCreateMember();
  const updateMemberMutation = useUpdateMember();

  const handleSubmit = async (formData: MemberFormData) => {
    if (isEdit && id) {
      await updateMemberMutation.mutateAsync({
        id,
        data: {
          name: formData.name,
          role: formData.role,
          division_id: formData.division_id || undefined,
          nim: formData.nim || undefined,
          phone: formData.phone || undefined,
        },
      });
      navigate(`/members/${id}`);
    } else {
      await createMemberMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password || 'Password123!',
        role: formData.role,
        division_id: formData.division_id || undefined,
        nim: formData.nim || undefined,
        phone: formData.phone || undefined,
      });
      navigate('/members');
    }
  };

  if (isEdit && isMemberLoading) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading member data..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? `Edit Member: ${member?.name}` : 'Add New Member'}
        description={
          isEdit
            ? 'Update member role, division assignment, or profile credentials.'
            : 'Register a new member to the GDGoC UNSRI roster.'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Members', href: '/members' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
        showBackButton
        backHref="/members"
      />

      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-subtle">
        <MemberForm
          initialData={member}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          isLoading={createMemberMutation.isPending || updateMemberMutation.isPending}
          onCancel={() => navigate('/members')}
        />
      </div>
    </div>
  );
};
