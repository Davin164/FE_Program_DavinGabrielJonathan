import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Attendance, ApiResponse } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEventAttendances = (eventId?: string) => {
  return useQuery({
    queryKey: ['attendances', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const { data } = await api.get<ApiResponse<Attendance[]>>(`/events/${eventId}/attendances`);
      return data.data || [];
    },
    enabled: Boolean(eventId),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.post<ApiResponse<Attendance>>(`/events/${eventId}/checkin`);
      return data.data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-attendances'] });
      toast.success('Check-in confirmed! Your attendance has been recorded.');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useMyAttendances = () => {
  return useQuery({
    queryKey: ['my-attendances'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Attendance[]>>('/attendances/my');
      return data.data || [];
    },
  });
};
