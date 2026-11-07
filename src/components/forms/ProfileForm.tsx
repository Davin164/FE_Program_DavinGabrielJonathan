import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  nim: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

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
