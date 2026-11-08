import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { useMembers } from '../../hooks/useMembers';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { PageHeader } from '../../components/common/PageHeader';
import { RoleBadge } from '../../components/common/RoleBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  PlusCircle,
  CalendarPlus,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  History,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const { data: membersData, isLoading: isMembersLoading } = useMembers({ limit: 1 });
  const { data: eventsData, isLoading: isEventsLoading } = useEvents({ limit: 100 });
  const { data: auditLogs = [], isLoading: isLogsLoading } = useAuditLogs(8);

  const allEvents = eventsData?.data || [];
  const now = new Date();

  const completedEventsCount = allEvents.filter((evt) => new Date(evt.end_time) < now).length;
  const upcomingEvents = allEvents.filter((evt) => new Date(evt.end_time) >= now);
  const totalMembersCount = membersData?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Member'}!`}
        description="Here is what is happening in GDGoC Universitas Sriwijaya today."
        actions={
          <div className="flex items-center gap-2">
            <RoleBadge role={role} />
          </div>
        }
      />

      <div className="p-4 bg-surface rounded-2xl border border-border shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {role === 'LEAD' && (
            <Link
              to="/members/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-subtle"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Member
            </Link>
          )}

          {role && role !== 'MEMBER' && (
            <>
              <Link
                to="/events/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-white hover:bg-secondary-hover transition-colors shadow-subtle"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Create Event
              </Link>
              <Link
                to="/attendance"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-text-primary hover:bg-gray-200 transition-colors"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                Monitor Attendance
              </Link>
            </>
          )}

          {role === 'MEMBER' && (
            <>
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-subtle"
              >
                <Calendar className="w-3.5 h-3.5" />
                Browse Events
              </Link>
              <Link
                to="/attendance"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-white hover:bg-secondary-hover transition-colors shadow-subtle"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Check In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Members
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isMembersLoading ? '...' : totalMembersCount}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Registered chapter members</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Completed Events
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isEventsLoading ? '...' : completedEventsCount}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Finished workshops & sessions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-light text-secondary flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Upcoming Events
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isEventsLoading ? '...' : upcomingEvents.length}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Scheduled & active sessions</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning-light text-warning-dark flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-subtle p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-text-primary">Upcoming Events</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Check out the latest GDGoC Universitas Sriwijaya sessions
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isEventsLoading ? (
          <LoadingSpinner size="md" className="py-8" />
        ) : upcomingEvents.length === 0 ? (
          <p className="text-xs text-text-secondary py-8 text-center">No upcoming events found</p>
        ) : (
          <div className="divide-y divide-border">
            {upcomingEvents.slice(0, 5).map((evt) => {
              const regCount = evt.registered_count ?? evt.registration_count ?? 0;
              const isOngoing =
                new Date(evt.start_time) <= now && new Date(evt.end_time) >= now;

              return (
                <div key={evt.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      to={`/events/${evt.id}`}
                      className="font-semibold text-sm text-text-primary hover:text-primary transition-colors block"
                    >
                      {evt.title}
                    </Link>
                    <span className="text-xs text-text-secondary">
                      {formatDateTime(evt.start_time)} • {evt.location || 'Online'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">
                      {regCount}/{evt.quota} spots
                    </span>
                    <StatusBadge status={isOngoing ? 'ongoing' : 'upcoming'} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Audit logs hanya untuk pengurus (Lead s.d. Core Team) */}
      {role && role !== 'MEMBER' && (
      <div className="bg-surface rounded-2xl border border-border shadow-subtle p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Audit Logs & Security Trail
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Riwayat perubahan role dan aksi administratif sensitif sesuai spesifikasi teknis GDGoC UNSRI.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-text-secondary flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            Live Trail
          </span>
        </div>

        {isLogsLoading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-text-secondary">
            Belum ada aktivitas audit log yang tercatat. Setiap perubahan role anggota akan tercatat di sini secara otomatis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 font-semibold">Actor / Pelaksana</th>
                  <th className="py-2.5 px-3 font-semibold">Aksi</th>
                  <th className="py-2.5 px-3 font-semibold">Tabel Sasaran</th>
                  <th className="py-2.5 px-3 font-semibold">Detail Perubahan</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => {
                  let detailText = '-';
                  const oldVal = log.old_value as Record<string, unknown> | null;
                  const newVal = log.new_value as Record<string, unknown> | null;
                  if (log.action === 'UPDATE_ROLE' || log.action === 'ROLE_CHANGE') {
                    detailText = `Perubahan Role: ${String(oldVal?.role ?? '-')} ➔ ${String(newVal?.role ?? '-')}`;
                  } else if (log.action === 'PROFILE_UPDATED' && newVal) {
                    detailText = `Profil diubah: ${Object.keys(newVal).join(', ')}`;
                  } else if (log.action === 'MEMBER_CREATED' && newVal) {
                    detailText = `Akun dibuat: ${String(newVal.name)} (${String(newVal.role)})`;
                  } else if (log.action === 'MEMBER_DELETED' && oldVal) {
                    detailText = `Akun dihapus: ${String(oldVal.name)} (${String(oldVal.role)})`;
                  } else if (log.action === 'EVENT_CREATED' && newVal) {
                    detailText = `Event dibuat: "${String(newVal.title)}"`;
                  } else if (log.action === 'EVENT_UPDATED' && newVal) {
                    detailText = `Event diperbarui: "${String(newVal.title)}"`;
                  } else if (log.action === 'EVENT_DELETED' && oldVal) {
                    detailText = `Event dihapus: "${String(oldVal.title)}"`;
                  } else if (newVal) {
                    detailText = JSON.stringify(newVal);
                  }

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary">
                            {log.actor?.name || 'System / Admin'}
                          </span>
                          {log.actor?.role && (
                            <RoleBadge role={log.actor.role} showIcon={false} className="text-[10px] py-0.5 px-2" />
                          )}
                        </div>
                        <span className="text-[11px] text-text-secondary block">
                          {log.actor?.email || 'system'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600">
                        {log.target_table || 'public'}
                      </td>
                      <td className="py-3 px-3 text-text-primary max-w-xs truncate" title={detailText}>
                        {detailText}
                      </td>
                      <td className="py-3 px-3 text-right text-text-secondary whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}
    </div>
  );
};
