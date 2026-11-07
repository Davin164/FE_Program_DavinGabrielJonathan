import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { useMembers } from '../../hooks/useMembers';
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
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const { data: membersData, isLoading: isMembersLoading } = useMembers({ limit: 1 });
  const { data: eventsData, isLoading: isEventsLoading } = useEvents({ limit: 100 });

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

      {/* Quick Action Bar for Roles */}
      <div className="p-4 bg-surface rounded-2xl border border-border shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          {(role === 'LEAD' || role === 'CO_LEAD') && (
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
                to="/attendance"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-text-primary hover:bg-gray-200 transition-colors"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                Monitor Attendance
              </Link>
            </>
          )}

          {role !== 'LEAD' && role !== 'CO_LEAD' && role !== 'MEMBER' && (
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

      {/* Stats Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Members */}
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

        {/* Completed Events */}
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

        {/* Upcoming Events */}
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

      {/* Main Dashboard Section: Upcoming Events List & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Events List */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border shadow-subtle p-6">
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
            <span>Universitas Sriwijaya</span>
          </div>
        </div>
      </div>
    </div>
  );
};
