import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembers, useDivisions, useDeleteMember } from '../../hooks/useMembers';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import { RoleBadge } from '../../components/common/RoleBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Eye, Edit2, Trash2, UserPlus, Filter } from 'lucide-react';

export const MembersPage: React.FC = () => {
  const { role: currentUserRole } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Deletion modal state
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);

  const { data: divisions = [] } = useDivisions();
  const { data, isLoading } = useMembers({
    page,
    limit,
    search: search || undefined,
    role: selectedRole || undefined,
    division_id: selectedDivision || undefined,
    sort: sortBy,
    order: sortOrder,
  });

  const deleteMemberMutation = useDeleteMember();

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    try {
      await deleteMemberMutation.mutateAsync(memberToDelete.id);
      setMemberToDelete(null);
    } catch {
      // handled by mutation onError
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Member Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link
              to={`/members/${user.id}`}
              className="font-semibold text-text-primary hover:text-primary transition-colors block"
            >
              {user.name}
            </Link>
            <span className="text-xs text-text-secondary sm:hidden block">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      className: 'hidden sm:table-cell',
      render: (user) => <span className="text-xs text-text-secondary">{user.email}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      key: 'division_name',
      header: 'Division',
      render: (user) => (
        <span className="text-xs font-medium text-text-primary">
          {user.division_name || '-'}
        </span>
      ),
    },
    {
      key: 'nim',
      header: 'NIM',
      className: 'hidden md:table-cell',
      render: (user) => (
        <span className="text-xs font-mono text-text-secondary">{user.nim || '-'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/members/${user.id}`}
            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {currentUserRole === 'LEAD' && (
            <>
              <Link
                to={`/members/${user.id}/edit`}
                className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                title="Edit member"
              >
                <Edit2 className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setMemberToDelete(user)}
                className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                title="Delete member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="GDGoC Members"
        description="Directory of registered members, division heads, and chapter leaders."
        actions={
          currentUserRole === 'LEAD' && (
            <Link
              to="/members/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-subtle transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Link>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-surface rounded-2xl border border-border shadow-subtle">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, email, or NIM..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filters:</span>
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Roles</option>
            <option value="LEAD">Lead</option>
            <option value="DIVISION_HEAD">Division Head</option>
            <option value="MEMBER">Member</option>
          </select>

          {/* Division Filter */}
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Divisions</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        meta={data?.meta}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setLimit(sz);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyTitle="No members found"
        emptyDescription="We couldn't find any member matching your criteria. Try resetting filters."
      />

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={Boolean(memberToDelete)}
        title="Delete Member"
        description={`Are you sure you want to remove ${memberToDelete?.name} from the active directory? This will deactivate their account.`}
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={deleteMemberMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onClose={() => setMemberToDelete(null)}
      />
    </div>
  );
};
