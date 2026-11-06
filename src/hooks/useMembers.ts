import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { User, Division, ApiResponse, MemberQueryParams } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

// Fetch all members with filters
export const useMembers = (params: MemberQueryParams = {}) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>('/members', { params });
      return data;
    },
  });
};

// Fetch single member by ID
export const useMember = (id?: string) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      if (!id) throw new Error('Member ID is required');
      const { data } = await api.get<ApiResponse<User>>(`/members/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
};

// Fetch divisions for dropdowns
export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<Division[]>>('/divisions');
        return data.data || [];
      } catch {
        // Fallback standard divisions for GDGoC UNSRI
        return [
          { id: '1', name: 'Core Team' },
          { id: '2', name: 'Mobile Development' },
          { id: '3', name: 'Web Development' },
          { id: '4', name: 'Cloud Computing' },
          { id: '5', name: 'Machine Learning' },
          { id: '6', name: 'Creative & Media' },
        ];
      }
    },
  });
};

// Create new member (LEAD only)
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<User> & { password?: string }) => {
      const { data } = await api.post<ApiResponse<User>>('/members', payload);
      return data.data;
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`Member ${newUser.name} created successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

// Update member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> & { password?: string } }) => {
      const res = await api.put<ApiResponse<User>>(`/members/${id}`, data);
      return res.data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', updatedUser.id] });
      toast.success(`Member ${updatedUser.name} updated successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

// Soft delete member
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/members/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Member removed successfully');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
