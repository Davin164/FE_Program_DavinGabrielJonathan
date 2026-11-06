import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { AuditLog, ApiResponse, AuditLogQueryParams } from '../types';

export const useAuditLogs = (params: AuditLogQueryParams = {}) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AuditLog[]>>('/audit-logs', { params });
      return data;
    },
  });
};

export const useRecentAuditLogs = (limit = 5) => {
  return useQuery({
    queryKey: ['audit-logs', 'recent', limit],
    queryFn: async () => {
      try {
        const { data } = await api.get<ApiResponse<AuditLog[]>>('/audit-logs', {
          params: { limit, page: 1 },
        });
        return data.data || [];
      } catch {
        return [];
      }
    },
  });
};
