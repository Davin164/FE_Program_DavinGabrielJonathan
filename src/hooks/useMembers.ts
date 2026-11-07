import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { User, Division, ApiResponse, MemberQueryParams } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useMembers = (params: MemberQueryParams = {}) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>('/members', { params });
      return data;
    },
  });
};

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

export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Division[]>>('/divisions');
      return data.data || [];
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<User> & { password?: string }) => {
      const { data } = await api.post<ApiResponse<User>>('/members', payload);
      return data.data;
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(`Member ${newUser.name} created successfully!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const { role, ...profileData } = data;
      const res = await api.put<ApiResponse<User>>(`/members/${id}`, profileData);
      let updatedUser = res.data.data;

      if (role && role !== updatedUser.role) {
        const roleRes = await api.patch<ApiResponse<User>>(`/members/${id}/role`, { role });
        updatedUser = roleRes.data.data;
      }

      return updatedUser;
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

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<ApiResponse<{ message: string }>>(`/members/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member removed successfully');
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
};
