import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { PaginationMeta } from '../../types';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  meta,
  onPageChange,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSort,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or search query.',
}: DataTableProps<T>) {
  const renderSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-text-primary transition-colors" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  const page = Number(meta?.page) || 1;
  const limit = Number(meta?.limit) || 10;
  const total = Number(meta?.total) || 0;
  const totalPages = Math.max(
    limit > 0 && total > 0
      ? Math.ceil(total / limit)
      : Number(meta?.totalPages) || Number(meta?.total_pages) || 1,
    1
  );

  return (
    <div className="bg-surface rounded-xl border border-border shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/75 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3.5 ${column.className || ''}`}
                >
                  {column.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      className="group inline-flex items-center gap-1.5 font-semibold text-text-secondary hover:text-text-primary"
                    >
                      {column.header}
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <LoadingSpinner size="lg" label="Loading data..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id ? String(row.id) : idx}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className={`px-4 py-3.5 text-text-primary ${column.className || ''}`}>
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, unknown>)[column.key] as React.ReactNode) ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-gray-50/30 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <span className="font-semibold text-text-primary">
                {total === 0 ? 0 : (page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-text-primary">
                {Math.min(page * limit, total)}
              </span>{' '}
              of <span className="font-semibold text-text-primary">{total}</span> entries
            </span>

            {onPageSizeChange && (
              <select
                value={limit}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="ml-3 bg-surface border border-border rounded-md px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-subtle cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (page > 1) onPageChange?.(1);
              }}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border bg-surface text-text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="First page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (page > 1) onPageChange?.(page - 1);
              }}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border bg-surface text-text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 py-1 font-semibold text-text-primary text-xs bg-gray-100 rounded-lg select-none">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => {
                if (page < totalPages) onPageChange?.(page + 1);
              }}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border bg-surface text-text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (page < totalPages) onPageChange?.(totalPages);
              }}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border bg-surface text-text-primary hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Last page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
