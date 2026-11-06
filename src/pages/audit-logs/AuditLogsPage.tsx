import React, { useState } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { AuditLog } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { SearchInput } from '../../components/common/SearchInput';
import { ShieldCheck, Filter, Code2, X } from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const AuditLogsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading } = useAuditLogs({
    page,
    limit,
    search: search || undefined,
    action: actionFilter || undefined,
  });

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('INSERT')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {action}
        </span>
      );
    }
    if (act.includes('UPDATE') || act.includes('EDIT')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {action}
        </span>
      );
    }
    if (act.includes('DELETE') || act.includes('REMOVE')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        {action}
      </span>
    );
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (log) => (
        <span className="text-xs font-mono text-text-secondary">
          {formatDateTime(log.created_at)}
        </span>
      ),
    },
    {
      key: 'actor_name',
      header: 'Actor',
      render: (log) => (
        <div>
          <span className="font-semibold text-xs text-text-primary block">
            {log.actor_name || 'System / Admin'}
          </span>
          <span className="text-[10px] text-text-secondary font-mono">{log.ip_address || '127.0.0.1'}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log) => getActionBadge(log.action),
    },
    {
      key: 'target_table',
      header: 'Target Entity',
      render: (log) => (
        <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
          {log.target_table}
        </span>
      ),
    },
    {
      key: 'changes',
      header: 'Changes',
      render: (log) => (
        <button
          type="button"
          onClick={() => setSelectedLog(log)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-primary" />
          View Diff
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Comprehensive immutable record of actions, role changes, and data modifications."
        actions={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light text-primary text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Lead Administrator Mode
          </div>
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
          placeholder="Search by actor or target..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CHECK_IN">CHECK_IN</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
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
        emptyTitle="No audit logs recorded"
        emptyDescription="System events, member modifications, and security actions will be recorded here."
      />

      {/* JSON Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-surface rounded-2xl shadow-card p-6 border border-border max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-text-primary">
                  Payload Diff: {selectedLog.action} on {selectedLog.target_table}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Old Value */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-rose-600 uppercase text-[11px] block">
                    Before (Old Value)
                  </span>
                  <pre className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl overflow-x-auto text-rose-900 min-h-[140px]">
                    {selectedLog.old_value
                      ? JSON.stringify(selectedLog.old_value, null, 2)
                      : '// No previous value'}
                  </pre>
                </div>

                {/* New Value */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-emerald-600 uppercase text-[11px] block">
                    After (New Value)
                  </span>
                  <pre className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl overflow-x-auto text-emerald-900 min-h-[140px]">
                    {selectedLog.new_value
                      ? JSON.stringify(selectedLog.new_value, null, 2)
                      : '// No new value'}
                  </pre>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-xs font-semibold text-text-primary bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
