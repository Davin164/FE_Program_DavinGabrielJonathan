import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from './useAuth';
import { User, MemberQueryParams } from '../types';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';

export const useMembers = (params: MemberQueryParams = {}) => {
  return useQuery({
    queryKey: ['members', params],
    queryFn: async () => {
      return supabaseService.members.getAll(params);
    },
    placeholderData: keepPreviousData,
  });
};

export const useMember = (id?: string) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: async () => {
      if (!id) throw new Error('Member ID is required');
      return supabaseService.members.getById(id);
    },
    enabled: Boolean(id),
  });
};

export const useDivisions = () => {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      return supabaseService.members.getDivisions();
    },
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: Partial<User> & { password?: string }) => {
      return supabaseService.members.create(payload, user?.id);
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      return supabaseService.members.update(id, data, user?.id);
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      return supabaseService.members.delete(id, user?.id);
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
