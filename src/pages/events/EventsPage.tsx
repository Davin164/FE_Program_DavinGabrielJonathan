import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useRegisterForEvent, useUnregisterFromEvent } from '../../hooks/useRegistrations';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchInput } from '../../components/common/SearchInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import {
  CalendarPlus,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';

export const EventsPage: React.FC = () => {
  const { role, user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');

  const { data, isLoading } = useEvents({
    search: search || undefined,
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();

  const events = data?.data || [];

  const handleRegisterToggle = async (eventId: string, isRegistered?: boolean) => {
    if (isRegistered) {
      await unregisterMutation.mutateAsync(eventId);
    } else {
      await registerMutation.mutateAsync(eventId);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="GDGoC Events & Workshops"
        description="Discover tech talks, coding bootcamps, and hackathons hosted by GDGoC UNSRI."
        actions={
          (role === 'LEAD' || role === 'DIVISION_HEAD') && (
            <Link
              to="/events/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-subtle transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              Create Event
            </Link>
          )
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-surface rounded-2xl border border-border shadow-subtle">
        <SearchInput
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search events by title or location..."
          className="max-w-md"
        />

        {/* Tab Filters */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('upcoming')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'upcoming'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('past')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterStatus === 'past'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <LoadingSpinner size="xl" className="py-24" label="Loading upcoming events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="There are currently no events matching your criteria. Check back soon for new sessions!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const regCount = evt.registration_count || 0;
            const quota = evt.quota || 1;
            const percentage = Math.min(Math.round((regCount / quota) * 100), 100);
            const isFull = regCount >= quota;
            const isRegistered = evt.is_registered;
            const isActionLoading =
              (registerMutation.isPending && registerMutation.variables === evt.id) ||
              (unregisterMutation.isPending && unregisterMutation.variables === evt.id);

            return (
              <div
                key={evt.id}
                className="bg-surface rounded-2xl border border-border overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Color Accent */}
                  <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

                  <div className="p-5 space-y-4">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <StatusBadge status={isFull ? 'full' : 'upcoming'} />
                      <span className="text-[11px] text-text-secondary font-medium">
                        By {evt.creator_name || 'GDGoC Team'}
                      </span>
                    </div>

                    {/* Event Title */}
                    <div>
                      <Link
                        to={`/events/${evt.id}`}
                        className="text-base font-bold text-text-primary hover:text-primary transition-colors line-clamp-2"
                      >
                        {evt.title}
                      </Link>
                      {evt.description && (
                        <p className="mt-1 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span>{formatDateTime(evt.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span className="truncate">{evt.location || 'Online Session'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-secondary shrink-0" />
                        <span>
                          {regCount} / {quota} registered ({percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isFull ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-secondary'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-text-secondary">
                        <span>{quota - regCount} spots remaining</span>
                        <span>{isFull ? 'Quota full' : 'Spots open'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50/70 border-t border-border flex items-center justify-between gap-3">
                  <Link
                    to={`/events/${evt.id}`}
                    className="text-xs font-semibold text-text-secondary hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {role === 'MEMBER' && (
                    <button
                      type="button"
                      onClick={() => handleRegisterToggle(evt.id, isRegistered)}
                      disabled={isActionLoading || (!isRegistered && isFull)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-subtle ${
                        isRegistered
                          ? 'bg-secondary text-white hover:bg-secondary-hover'
                          : isFull
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-hover'
                      }`}
                    >
                      {isActionLoading ? (
                        <LoadingSpinner size="sm" className="p-0 text-white" />
                      ) : isRegistered ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Registered
                        </>
                      ) : isFull ? (
                        'Full'
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
