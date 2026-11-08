export type Role =
  | 'LEAD'
  | 'CO_LEAD'
  | 'SECRETARY_1'
  | 'SECRETARY_2'
  | 'TREASURER_1'
  | 'TREASURER_2'
  | 'CORE_TEAM'
  | 'MEMBER';

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
  registered_count?: number;
  registration_count?: number;
  remaining_quota?: number;
  is_registered?: boolean;
  is_checked_in?: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  name?: string;
  email?: string;
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
  name?: string;
  email?: string;
  user_name?: string;
  user_email?: string;
  title?: string;
  checked_in_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  total_pages?: number;
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
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  upcoming?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}
