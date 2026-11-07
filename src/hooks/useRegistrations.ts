import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Registration, ApiResponse } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEventRegistrations = (eventId?: string) => {
  return useQuery({
    queryKey: ['registrations', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data } = await api.get<ApiResponse<Registration[]>>(`/events/${eventId}/registrations`);
      return data.data || [];
    },
    enabled: Boolean(eventId),
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.post<ApiResponse<Registration>>(`/events/${eventId}/register`);
      return data.data;
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

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/events/${eventId}/register`);
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['registrations', eventId] });
      toast.info('You have cancelled your registration.');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
