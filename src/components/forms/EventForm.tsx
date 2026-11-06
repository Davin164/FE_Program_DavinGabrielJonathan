import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Event } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

const eventFormSchema = z
  .object({
    title: z.string().min(3, 'Event title must be at least 3 characters'),
    description: z.string().optional(),
    quota: z.coerce.number().int().min(1, 'Quota must be at least 1 participant'),
    start_time: z.string().min(1, 'Start date and time is required'),
    end_time: z.string().min(1, 'End date and time is required'),
    location: z.string().min(1, 'Location or venue link is required'),
  })
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return true;
      return new Date(data.start_time) < new Date(data.end_time);
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  );

export type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  initialData?: Event | null;
  onSubmit: (data: EventFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
}

// Convert ISO string to HTML datetime-local format "YYYY-MM-DDTHH:mm"
const toDateTimeLocal = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  } catch {
    return '';
  }
};

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      quota: initialData?.quota || 50,
      start_time: toDateTimeLocal(initialData?.start_time),
      end_time: toDateTimeLocal(initialData?.end_time),
      location: initialData?.location || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="e.g. Workshop: Build Modern Web Apps with Next.js"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Location / Venue *
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="e.g. Lab Multimedia FASILKOM or Google Meet"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.location && <p className="mt-1 text-xs text-danger">{errors.location.message}</p>}
        </div>

        {/* Quota */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Participant Quota *
          </label>
          <input
            type="number"
            {...register('quota')}
            min={1}
            placeholder="50"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.quota && <p className="mt-1 text-xs text-danger">{errors.quota.message}</p>}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Start Time *
          </label>
          <input
            type="datetime-local"
            {...register('start_time')}
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.start_time && (
            <p className="mt-1 text-xs text-danger">{errors.start_time.message}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            End Time *
          </label>
          <input
            type="datetime-local"
            {...register('end_time')}
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.end_time && <p className="mt-1 text-xs text-danger">{errors.end_time.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Event Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Provide details about the agenda, speakers, prerequisites, and goals..."
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-danger">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-xl transition-colors border border-border"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-subtle transition-colors flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" className="p-0 text-white" />}
          {isEdit ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};
