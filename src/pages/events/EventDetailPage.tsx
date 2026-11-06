import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvent, useDeleteEvent } from '../../hooks/useEvents';
import { useEventRegistrations, useRegisterForEvent, useUnregisterFromEvent } from '../../hooks/useRegistrations';
import { useEventAttendances } from '../../hooks/useAttendances';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RoleBadge } from '../../components/common/RoleBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Calendar,
  MapPin,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { formatDateTime, formatDate, formatTime } from '../../lib/utils';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: event, isLoading: isEventLoading, error } = useEvent(id);
  const { data: registrations = [], isLoading: isRegLoading } = useEventRegistrations(id);
  const { data: attendances = [], isLoading: isAttLoading } = useEventAttendances(id);

  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterFromEvent();
  const deleteEventMutation = useDeleteEvent();

  const isPrivileged = role === 'LEAD' || role === 'DIVISION_HEAD';

  if (isEventLoading) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <div className="py-12">
        <EmptyState
          title="Event Not Found"
          description="The requested event might have been removed or does not exist."
          action={{
            label: 'Back to Events',
            onClick: () => navigate('/events'),
          }}
        />
      </div>
    );
  }

  const regCount = event.registration_count ?? registrations.length;
  const quota = event.quota || 1;
  const percentage = Math.min(Math.round((regCount / quota) * 100), 100);
  const isFull = regCount >= quota;

  // Check if current user is registered
  const isRegistered =
    event.is_registered || registrations.some((r) => r.user_id === user?.id);

  const handleRegisterToggle = async () => {
    if (!id) return;
    if (isRegistered) {
      await unregisterMutation.mutateAsync(id);
    } else {
      await registerMutation.mutateAsync(id);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteEventMutation.mutateAsync(id);
    navigate('/events');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Events', href: '/events' },
          { label: event.title },
        ]}
        showBackButton
        backHref="/events"
        actions={
          isPrivileged && (
            <div className="flex items-center gap-2">
              <Link
                to={`/events/${event.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-subtle transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Event
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-danger-light hover:bg-danger text-danger hover:text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={isFull ? 'full' : 'upcoming'} />
              <span className="text-xs text-text-secondary">
                Created by <span className="font-semibold">{event.creator_name || 'Admin'}</span>
              </span>
            </div>

            <h1 className="text-xl font-bold text-text-primary">{event.title}</h1>

            <div className="prose max-w-none text-sm text-text-secondary whitespace-pre-line leading-relaxed">
              {event.description || 'No description provided for this event.'}
            </div>
          </div>

          {/* Registrations List (LEAD / DIV_HEAD only) */}
          {isPrivileged && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Registered Attendees ({registrations.length})
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Members registered for this event session
                  </p>
                </div>
                <Users className="w-4 h-4 text-primary" />
              </div>

              {isRegLoading ? (
                <LoadingSpinner size="md" className="py-6" />
              ) : registrations.length === 0 ? (
                <p className="text-xs text-text-secondary py-4 text-center">
                  No members have registered for this event yet.
                </p>
              ) : (
                <div className="divide-y divide-border max-h-60 overflow-y-auto">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-[10px]">
                          {reg.user_name ? reg.user_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{reg.user_name}</p>
                          <p className="text-[11px] text-text-secondary">{reg.user_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reg.user_role && <RoleBadge role={reg.user_role} showIcon={false} />}
                        <span className="text-[11px] text-text-secondary">
                          {formatDate(reg.registered_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance Check-in Logs (LEAD / DIV_HEAD only) */}
          {isPrivileged && (
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Check-in Records ({attendances.length})
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Real-time participant check-ins
                  </p>
                </div>
                <UserCheck className="w-4 h-4 text-secondary" />
              </div>

              {isAttLoading ? (
                <LoadingSpinner size="md" className="py-6" />
              ) : attendances.length === 0 ? (
                <p className="text-xs text-text-secondary py-4 text-center">
                  No attendance records recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-border max-h-60 overflow-y-auto">
                  {attendances.map((att) => (
                    <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-text-primary">{att.user_name}</p>
                        <p className="text-[11px] text-text-secondary">{att.user_email}</p>
                      </div>
                      <span className="text-[11px] text-secondary font-medium">
                        Checked in at {formatTime(att.checked_in_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Logistics & Registration Action Card */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border">
              Session Schedule & Venue
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-secondary block">Date & Time</span>
                  <span className="font-semibold text-text-primary text-sm">
                    {formatDateTime(event.start_time)}
                  </span>
                  <span className="text-text-secondary block text-[11px] mt-0.5">
                    Until {formatDateTime(event.end_time)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-text-secondary block">Location / Meeting Link</span>
                  <span className="font-semibold text-text-primary text-sm">
                    {event.location || 'Online Session'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="text-text-secondary block">Quota & Registration</span>
                  <div className="flex justify-between items-center text-sm font-semibold text-text-primary mt-0.5">
                    <span>
                      {regCount} / {quota} spots filled
                    </span>
                    <span className="text-xs font-normal text-text-secondary">{percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isFull ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-secondary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Action for Member */}
            <div className="pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleRegisterToggle}
                disabled={
                  registerMutation.isPending ||
                  unregisterMutation.isPending ||
                  (!isRegistered && isFull)
                }
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle ${
                  isRegistered
                    ? 'bg-secondary text-white hover:bg-secondary-hover'
                    : isFull
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover'
                }`}
              >
                {registerMutation.isPending || unregisterMutation.isPending ? (
                  <LoadingSpinner size="sm" className="p-0 text-white" />
                ) : isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Registered (Click to Cancel)
                  </>
                ) : isFull ? (
                  'Registration Full'
                ) : (
                  'Register For This Event'
                )}
              </button>
              {isRegistered && (
                <p className="text-[11px] text-text-secondary text-center mt-2">
                  You are registered! Head over to the Attendance tab during the event to check in.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Event Modal */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Event"
        description={`Are you sure you want to remove "${event.title}"? All current registrations will be archived.`}
        confirmText="Yes, Delete Event"
        variant="danger"
        isLoading={deleteEventMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
