import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Role } from '../../types';
import { useDivisions } from '../../hooks/useMembers';
import { LoadingSpinner } from '../common/LoadingSpinner';

const memberFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  role: z.enum(['LEAD', 'DIVISION_HEAD', 'MEMBER']),
  division_id: z.string().optional(),
  nim: z.string().min(8, 'NIM must be at least 8 characters').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export type MemberFormData = z.infer<typeof memberFormSchema>;

interface MemberFormProps {
  initialData?: User | null;
  onSubmit: (data: MemberFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
  isEdit = false,
}) => {
  const { data: divisions = [] } = useDivisions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: (initialData?.role as Role) || 'MEMBER',
      division_id: initialData?.division_id || '',
      nim: initialData?.nim || '',
      phone: initialData?.phone || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. Budi Santoso"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="e.g. member@unsri.ac.id"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            {isEdit ? 'New Password (leave empty to keep current)' : 'Password *'}
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder={isEdit ? '••••••••' : 'Minimum 6 characters'}
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Role *
          </label>
          <select
            {...register('role')}
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          >
            <option value="MEMBER">Member</option>
            <option value="DIVISION_HEAD">Division Head</option>
            <option value="LEAD">Lead</option>
          </select>
          {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
        </div>

        {/* Division */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Division
          </label>
          <select
            {...register('division_id')}
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          >
            <option value="">Select Division (Optional)</option>
            {divisions.map((div) => (
              <option key={div.id} value={div.id}>
                {div.name}
              </option>
            ))}
          </select>
          {errors.division_id && (
            <p className="mt-1 text-xs text-danger">{errors.division_id.message}</p>
          )}
        </div>

        {/* Student ID / NIM */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            NIM (Student ID)
          </label>
          <input
            type="text"
            {...register('nim')}
            placeholder="e.g. 09021282126045"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.nim && <p className="mt-1 text-xs text-danger">{errors.nim.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="e.g. 081234567890"
            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
          />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-xl transition-colors border border-border"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-subtle transition-colors flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" className="p-0 text-white" />}
          {isEdit ? 'Save Changes' : 'Create Member'}
        </button>
      </div>
    </form>
  );
};
