export type Role = 'LEAD' | 'DIVISION_HEAD' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  division_id?: string | null;
  division_name?: string | null;
  nim?: string | null;
  phone?: string | null;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Division {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  quota: number;
  start_time: string;
  end_time: string;
  location?: string;
  created_by: string;
  creator_name?: string;
  registration_count?: number;
  is_registered?: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  user_name?: string;
  user_email?: string;
  user_role?: Role;
  division_name?: string;
  registered_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  event_id: string;
  user_name?: string;
  user_email?: string;
  checked_in_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name?: string;
  target_id: string;
  target_table: string;
  action: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  ip_address?: string;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface MemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  division_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'upcoming' | 'ongoing' | 'past';
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  target_table?: string;
  start_date?: string;
  end_date?: string;
}

export interface DashboardStats {
  total_members: number;
  active_events: number;
  registrations_today: number;
  upcoming_events: number;
}
