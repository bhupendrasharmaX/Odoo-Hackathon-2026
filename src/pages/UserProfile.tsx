import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { User, Lock, Clock, CheckCircle, Save, Camera } from 'lucide-react';

const profileSchema = zod.object({
  firstName: zod.string().min(2, 'First name is required'),
  lastName: zod.string().min(2, 'Last name is required'),
  email: zod.string().email('Valid email is required'),
  phone: zod.string().min(10, 'Valid phone number is required'),
  department: zod.string().min(2, 'Department is required'),
  location: zod.string().min(2, 'Location is required'),
});

const passwordSchema = zod.object({
  currentPassword: zod.string().min(6, 'Current password must be 6+ chars'),
  newPassword: zod.string().min(6, 'New password must be 6+ chars'),
  confirmPassword: zod.string().min(6, 'Confirm password must match'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFields = zod.infer<typeof profileSchema>;
type PasswordFields = zod.infer<typeof passwordSchema>;

export default function UserProfile() {
  const [successMsg, setSuccessMsg] = useState('');
  
  // Profile Form
  const { register: regProfile, handleSubmit: valProfile, formState: { errors: errProfile } } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      email: 'arjun.sharma@transitops.com',
      phone: '+91 98765 12345',
      department: 'Fleet Operations',
      location: 'Mumbai, India',
    }
  });

  // Password Form
  const { register: regPassword, handleSubmit: valPassword, formState: { errors: errPassword }, reset: resetPassword } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = (data: ProfileFields) => {
    console.log('Profile updated:', data);
    setSuccessMsg('Profile information updated successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const onUpdatePassword = (data: PasswordFields) => {
    console.log('Password updated:', data);
    setSuccessMsg('Your security password has been changed.');
    resetPassword();
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-background">My Profile</h1>
        <p className="text-sm text-on-surface-variant">Manage your account information, security credentials, and view system activities.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Info Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar Header Card */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-3xl mb-1 sm:mb-0">
                AS
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white shadow-md hover:bg-primary/95 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-on-surface">Arjun Sharma</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Active</span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium mt-0.5">Fleet Operations Manager</p>
              <p className="text-xs text-on-surface-variant mt-1.5">arjun.sharma@transitops.com • Mumbai Division</p>
            </div>
          </div>

          {/* Personal Info Form Card */}
          <form onSubmit={valProfile(onUpdateProfile)} className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">First Name *</label>
                <input 
                  {...regProfile('firstName')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.firstName && <p className="text-xs text-error mt-1">{errProfile.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Last Name *</label>
                <input 
                  {...regProfile('lastName')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.lastName && <p className="text-xs text-error mt-1">{errProfile.lastName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address *</label>
                <input 
                  {...regProfile('email')}
                  type="email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.email && <p className="text-xs text-error mt-1">{errProfile.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number *</label>
                <input 
                  {...regProfile('phone')}
                  type="tel" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.phone && <p className="text-xs text-error mt-1">{errProfile.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Department *</label>
                <input 
                  {...regProfile('department')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.department && <p className="text-xs text-error mt-1">{errProfile.department.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Office Location *</label>
                <input 
                  {...regProfile('location')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errProfile.location && <p className="text-xs text-error mt-1">{errProfile.location.message}</p>}
              </div>
            </div>

            <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/95 transition-colors flex items-center gap-1.5 shadow-xs">
              <Save className="w-4 h-4" /> Save Information
            </button>
          </form>
        </div>

        {/* Password and Activity log column */}
        <div className="space-y-6">
          {/* Security Change password form */}
          <form onSubmit={valPassword(onUpdatePassword)} className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Update Password
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Current Password *</label>
                <input 
                  {...regPassword('currentPassword')}
                  type="password" 
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
                />
                {errPassword.currentPassword && <p className="text-xs text-error mt-1">{errPassword.currentPassword.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">New Password *</label>
                <input 
                  {...regPassword('newPassword')}
                  type="password" 
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
                />
                {errPassword.newPassword && <p className="text-xs text-error mt-1">{errPassword.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Confirm New Password *</label>
                <input 
                  {...regPassword('confirmPassword')}
                  type="password" 
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
                />
                {errPassword.confirmPassword && <p className="text-xs text-error mt-1">{errPassword.confirmPassword.message}</p>}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/95 transition-colors text-sm shadow-xs">
              Change Security Password
            </button>
          </form>

          {/* Activity Log list */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Activity Log
            </h3>
            <div className="relative pl-5 border-l-2 border-outline-variant/40 space-y-4 text-xs text-on-surface-variant">
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="font-semibold text-on-surface">Created Trip TR-8829</div>
                <span>10 minutes ago</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <div className="font-semibold text-on-surface">Approved Expense EXP-2004</div>
                <span>2 hours ago</span>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-outline rounded-full"></div>
                <div className="font-semibold text-on-surface">Updated Vehicle V-204 status</div>
                <span>Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
