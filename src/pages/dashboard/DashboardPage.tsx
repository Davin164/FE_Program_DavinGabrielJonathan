import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats, useEvents } from '../../hooks/useEvents';
import { useRecentAuditLogs } from '../../hooks/useAuditLogs';
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
  ShieldAlert,
  ClipboardCheck,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { data: auditLogs = [], isLoading: isAuditLoading } = useRecentAuditLogs(5);
  const { data: eventsData, isLoading: isEventsLoading } = useEvents({ limit: 5 });

  const events = eventsData?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name || 'Member'}! 👋`}
        description="Here is what is happening in GDGoC Universitas Sriwijaya today."
        actions={
          <div className="flex items-center gap-2">
            <RoleBadge role={role} />
          </div>
        }
      />

      {/* Quick Action Bar for Roles */}
      <div className="p-4 bg-surface rounded-2xl border border-border shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {role === 'LEAD' && (
            <>
              <Link
                to="/members/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-subtle"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Member
              </Link>
              <Link
                to="/events/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-white hover:bg-secondary-hover transition-colors shadow-subtle"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Create Event
              </Link>
              <Link
                to="/audit-logs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-text-primary hover:bg-gray-200 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-danger" />
                Audit Logs
              </Link>
            </>
          )}

          {role === 'DIVISION_HEAD' && (
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-subtle"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Members
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isStatsLoading ? '...' : stats?.total_members ?? 0}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Active UNSRI chapters</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Active Events
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isStatsLoading ? '...' : stats?.active_events ?? 0}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Ongoing workshops & meets</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-light text-secondary flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Registrations Today */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Registrations Today
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isStatsLoading ? '...' : stats?.registrations_today ?? 0}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">New student sign-ups</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-danger-light text-danger flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Upcoming Events
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {isStatsLoading ? '...' : stats?.upcoming_events ?? 0}
            </p>
            <span className="text-[11px] text-text-secondary mt-1 block">Scheduled for next 30 days</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning-light text-warning-dark flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Section: Recent Activities or Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table (Audit log for LEAD, or Recent Events for Member/Div Head) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border shadow-subtle p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {role === 'LEAD' ? 'Recent Audit Trail' : 'Upcoming & Featured Events'}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {role === 'LEAD'
                  ? 'Real-time security logs and system activity'
                  : 'Check out the latest GDGoC UNSRI sessions'}
              </p>
            </div>
            <Link
              to={role === 'LEAD' ? '/audit-logs' : '/events'}
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {role === 'LEAD' ? (
            isAuditLoading ? (
              <LoadingSpinner size="md" className="py-8" />
            ) : auditLogs.length === 0 ? (
              <p className="text-xs text-text-secondary py-8 text-center">No recent audit logs</p>
            ) : (
              <div className="divide-y divide-border">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-text-primary">{log.actor_name || 'System'}</span>
                      <span className="text-text-secondary"> {log.action.toLowerCase()} on </span>
                      <span className="font-medium text-text-primary">{log.target_table}</span>
                    </div>
                    <span className="text-text-secondary">{formatDateTime(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )
          ) : isEventsLoading ? (
            <LoadingSpinner size="md" className="py-8" />
          ) : events.length === 0 ? (
            <p className="text-xs text-text-secondary py-8 text-center">No upcoming events found</p>
          ) : (
            <div className="divide-y divide-border">
              {events.slice(0, 5).map((evt) => (
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
                      {evt.registration_count || 0}/{evt.quota} spots
                    </span>
                    <StatusBadge status="upcoming" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: About GDGoC UNSRI & Guidelines */}
        <div className="bg-surface rounded-2xl border border-border shadow-subtle p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <h3 className="text-sm font-bold text-text-primary">Chapter Announcements</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Google Developer Groups on Campus (GDGoC) Universitas Sriwijaya is a student-led
              technology community supported by Google Developers.
            </p>
            <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-border/70 space-y-2 text-xs">
              <p className="font-semibold text-text-primary">Upcoming Milestones:</p>
              <ul className="list-disc pl-4 space-y-1 text-text-secondary">
                <li>Core Team onboarding workshop</li>
                <li>Google Solution Challenge 2026 kick-off</li>
                <li>Web & Cloud Division study jams</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-secondary">
            <span>UNSRI Indralaya & Palembang</span>
            <span className="font-medium text-primary">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
