import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import { AuditLog } from '../types';

export const useAuditLogs = (limit = 10) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: async (): Promise<AuditLog[]> => {
      return supabaseService.auditLogs.getAll(limit);
    },
    refetchInterval: 15000,
  });
};

