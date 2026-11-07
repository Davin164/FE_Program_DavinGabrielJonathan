import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './useAuth';
import { Registration } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEventRegistrations = (eventId?: string) => {
  return useQuery({
    queryKey: ['registrations', eventId],
    queryFn: async (): Promise<Registration[]> => {
      if (!eventId) return [];
      return supabaseService.registrations.getByEvent(eventId);
    },
    enabled: Boolean(eventId),
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('You must be logged in to register for an event');
      return supabaseService.registrations.register(eventId, user.id);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
      toast.success('Successfully registered for this event!');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useUnregisterFromEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('You must be logged in');
      return supabaseService.registrations.unregister(eventId, user.id);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
      toast.success('Registration cancelled successfully');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
