import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './useAuth';
import { Event, EventQueryParams } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEvents = (params: EventQueryParams = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['events', params, user?.id],
    queryFn: async () => {
      return supabaseService.events.getAll(params, user?.id);
    },
  });
};

export const useEvent = (id?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['events', id, user?.id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      return supabaseService.events.getById(id, user?.id);
    },
    enabled: Boolean(id),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: Omit<Event, 'id' | 'created_by' | 'created_at'>) => {
      if (!user?.id) throw new Error('You must be logged in to create an event');
      return supabaseService.events.create(payload, user.id);
    },
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(`Event "${newEvent.title}" created successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      return supabaseService.events.update(id, data, user?.id);
    },
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', updatedEvent.id] });
      toast.success(`Event "${updatedEvent.title}" updated successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      return supabaseService.events.delete(id, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
