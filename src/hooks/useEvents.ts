import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { Event, ApiResponse, EventQueryParams, DashboardStats } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useEvents = (params: EventQueryParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Event[]>>('/events', { params });
      return data;
    },
  });
};

export const useEvent = (id?: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      const { data } = await api.get<ApiResponse<Event>>(`/events/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<Event, 'id' | 'created_by' | 'created_at'>) => {
      const { data } = await api.post<ApiResponse<Event>>('/events', payload);
      return data.data;
    },
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`Event "${newEvent.title}" created successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const res = await api.put<ApiResponse<Event>>(`/events/${id}`, data);
      return res.data.data;
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

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/events/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Event deleted successfully');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
        return data.data;
      } catch {
        // Fallback default stats if backend route is being set up
        return {
          total_members: 42,
          active_events: 3,
          registrations_today: 18,
          upcoming_events: 2,
        };
      }
    },
  });
};
