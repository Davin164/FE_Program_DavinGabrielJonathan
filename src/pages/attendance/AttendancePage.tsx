import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEvents } from '../../hooks/useEvents';
import { useEventAttendances, useCheckIn, useMyAttendances } from '../../hooks/useAttendances';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { formatDateTime, formatDate, formatTime } from '../../lib/utils';
import { isWithinInterval, parseISO } from 'date-fns';

export const AttendancePage: React.FC = () => {
  const { role, user } = useAuth();
  const isPrivileged = role === 'LEAD' || role === 'DIVISION_HEAD';

  // State
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Queries
  const { data: eventsData, isLoading: isEventsLoading } = useEvents();
  const events = eventsData?.data || [];

  // Selected event for admin view or member view
  const currentEvent =
    events.find((e) => e.id === selectedEventId) || (events.length > 0 ? events[0] : null);

  const activeEventId = currentEvent?.id;

  const { data: attendances = [], isLoading: isAttLoading } = useEventAttendances(activeEventId);
  const { data: myAttendances = [], isLoading: isMyAttLoading } = useMyAttendances();

  const checkInMutation = useCheckIn();

  // Determine if active event is ongoing right now
  const isOngoing = React.useMemo(() => {
    if (!currentEvent) return false;
    try {
      const now = new Date();
      const start = parseISO(currentEvent.start_time);
      const end = parseISO(currentEvent.end_time);
      return isWithinInterval(now, { start, end });
    } catch {
      return true;
    }
  }, [currentEvent]);

  // Check if current user has already checked in for this event
  const myCurrentCheckIn = myAttendances.find((a) => a.event_id === activeEventId);

  const handleCheckIn = async () => {
    if (!activeEventId) return;
    await checkInMutation.mutateAsync(activeEventId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Attendance & Check-In"
        description="Verify your attendance for ongoing GDGoC UNSRI sessions and view real-time participation logs."
      />

      {/* Event Selection Dropdown */}
      <div className="p-4 bg-surface rounded-2xl border border-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-text-primary">Selected Event:</span>
        </div>

        {isEventsLoading ? (
          <LoadingSpinner size="sm" />
        ) : events.length === 0 ? (
          <span className="text-xs text-text-secondary">No events available</span>
        ) : (
          <select
            value={activeEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full sm:w-auto min-w-[280px] px-3.5 py-2 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({formatDate(evt.start_time)})
              </option>
            ))}
          </select>
        )}
      </div>

      {currentEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Check-in Hub */}
          <div className="lg:col-span-1 bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <StatusBadge
                  status={
                    isOngoing
                      ? 'ongoing'
                      : new Date(currentEvent.end_time) < new Date()
                      ? 'past'
                      : 'upcoming'
                  }
                />
                <span className="text-xs text-text-secondary">
                  {formatDateTime(currentEvent.start_time)}
                </span>
              </div>

              <h2 className="text-lg font-bold text-text-primary mb-2">{currentEvent.title}</h2>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                {isOngoing
                  ? 'This event is currently in session. Please check in now to record your verified attendance.'
                  : 'Check-in is available during the scheduled event time window for registered participants.'}
              </p>

              {/* Check-in Status or Button */}
              {myCurrentCheckIn ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-800">Check-in Confirmed!</h4>
                  <p className="text-xs text-emerald-700">
                    Recorded at {formatDateTime(myCurrentCheckIn.checked_in_at)}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={checkInMutation.isPending || !activeEventId}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary-hover shadow-subtle transition-all flex items-center justify-center gap-2"
                >
                  {checkInMutation.isPending ? (
                    <LoadingSpinner size="sm" className="p-0 text-white" />
                  ) : (
                    <>
                      <ClipboardCheck className="w-5 h-5" />
                      Check In Now
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Signed as {user?.name} ({role})</span>
            </div>
          </div>

          {/* Right 2 Cols: Attendance Roster / Records */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  {isPrivileged ? 'Attendance Roster' : 'My Recent Check-ins'}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isPrivileged
                    ? `Live attendance list for ${currentEvent.title}`
                    : 'History of your verified event attendances'}
                </p>
              </div>
              <div className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-text-primary">
                {isPrivileged ? `${attendances.length} Checked In` : `${myAttendances.length} Total`}
              </div>
            </div>

            {isPrivileged ? (
              isAttLoading ? (
                <LoadingSpinner size="lg" className="py-16" />
              ) : attendances.length === 0 ? (
                <EmptyState
                  icon={UserCheck}
                  title="No check-ins yet"
                  description="When members confirm their attendance during the session, they will appear here in real time."
                />
              ) : (
                <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                  {attendances.map((att, idx) => {
                    const displayName = att.name || att.user_name || 'Member';
                    const displayEmail = att.email || att.user_email || '';
                    return (
                      <div
                        key={att.id || idx}
                        className="py-3 flex items-center justify-between hover:bg-gray-50/60 px-2 rounded-lg transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-secondary-light text-secondary font-bold flex items-center justify-center text-xs">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary">{displayName}</p>
                            <p className="text-[11px] text-text-secondary">{displayEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-emerald-700 block">
                            {formatTime(att.checked_in_at)}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            {formatDate(att.checked_in_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : isMyAttLoading ? (
              <LoadingSpinner size="lg" className="py-16" />
            ) : myAttendances.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="No attendance records"
                description="You haven't checked in to any events yet. When you join upcoming sessions, your record will be displayed here."
              />
            ) : (
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {myAttendances.map((att, idx) => (
                  <div key={att.id || idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {att.title || events.find((e) => e.id === att.event_id)?.title || 'GDGoC Session'}
                      </p>
                      <span className="text-[11px] text-text-secondary">
                        Checked in at {formatDateTime(att.checked_in_at)}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
