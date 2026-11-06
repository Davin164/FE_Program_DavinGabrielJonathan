import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

const profileFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    nim: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    current_password: z.string().optional().or(z.literal('')),
    new_password: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
    confirm_password: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.new_password && !data.current_password) {
        return false;
      }
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['current_password'],
    }
  )
  .refine(
    (data) => {
      if (data.new_password && data.new_password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }
  );

export type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      nim: user.nim || '',
      phone: user.phone || '',
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-5">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              {...register('email')}
              disabled
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-border rounded-xl text-text-secondary cursor-not-allowed shadow-subtle"
            />
          </div>

          {/* NIM */}
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
      </div>

      {/* Password Change Section */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-5">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border">
          Security & Password Change
        </h3>
        <p className="text-xs text-text-secondary">
          Leave the password fields blank if you do not wish to update your password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              {...register('current_password')}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
            />
            {errors.current_password && (
              <p className="mt-1 text-xs text-danger">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              {...register('new_password')}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
            />
            {errors.new_password && (
              <p className="mt-1 text-xs text-danger">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register('confirm_password')}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-xs text-danger">{errors.confirm_password.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl shadow-subtle transition-colors flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" className="p-0 text-white" />}
          Update Profile
        </button>
      </div>
    </form>
  );
};
