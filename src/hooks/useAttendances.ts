import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './useAuth';
import { Attendance } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEventAttendances = (eventId?: string) => {
  return useQuery({
    queryKey: ['attendances', eventId],
    queryFn: async (): Promise<Attendance[]> => {
      if (!eventId) return [];
      return supabaseService.attendances.getByEvent(eventId);
    },
    enabled: Boolean(eventId),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('You must be logged in to check in');
      return supabaseService.attendances.checkIn(eventId, user.id);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-attendances'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Check-in confirmed! Your attendance has been recorded.');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useMyAttendances = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-attendances', user?.id],
    queryFn: async (): Promise<Attendance[]> => {
      if (!user?.id) return [];
      return supabaseService.attendances.getMyAttendances(user.id);
    },
    enabled: Boolean(user?.id),
  });
};

export const useCancelAttendance = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ eventId, attendanceId }: { eventId: string; attendanceId?: string }) => {
      if (attendanceId) {
        return supabaseService.attendances.deleteAttendance(attendanceId);
      }
      if (!user?.id) throw new Error('You must be logged in to cancel attendance');
      return supabaseService.attendances.cancelCheckIn(eventId, user.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-attendances'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Kehadiran berhasil dibatalkan (Attendance cancelled)');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
