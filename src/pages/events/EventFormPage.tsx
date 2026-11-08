import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useCreateEvent, useUpdateEvent } from '../../hooks/useEvents';
import { PageHeader } from '../../components/common/PageHeader';
import { EventForm, EventFormData } from '../../components/forms/EventForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EventFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: event, isLoading: isEventLoading } = useEvent(id);
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const handleSubmit = async (formData: EventFormData) => {
    const startIso = new Date(formData.start_time).toISOString();
    const endIso = new Date(formData.end_time).toISOString();

    if (isEdit && id) {
      await updateEventMutation.mutateAsync({
        id,
        data: {
          title: formData.title,
          description: formData.description,
          quota: formData.quota,
          location: formData.location,
          start_time: startIso,
          end_time: endIso,
        },
      });
      navigate(`/events/${id}`);
    } else {
      await createEventMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        quota: formData.quota,
        location: formData.location,
        start_time: startIso,
        end_time: endIso,
      });
      navigate('/events');
    }
  };

  if (isEdit && isEventLoading) {
    return <LoadingSpinner size="lg" className="py-24" label="Loading event data..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? `Edit Event: ${event?.title}` : 'Create New Event'}
        description={
          isEdit
            ? 'Modify workshop or session schedule and quota parameters.'
            : 'Schedule a new workshop, hackathon, or meet for GDGoC UNSRI.'
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Events', href: '/events' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
        showBackButton
        backHref="/events"
      />

      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-subtle">
        <EventForm
          initialData={event}
          isEdit={isEdit}
          onSubmit={handleSubmit}
          isLoading={createEventMutation.isPending || updateEventMutation.isPending}
          onCancel={() => navigate('/events')}
        />
      </div>
    </div>
  );
};
