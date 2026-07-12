import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ArrowLeft, UploadCloud, CheckCircle } from 'lucide-react';

const driverSchema = zod.object({
  name: zod.string().min(2, 'Name is required'),
  phone: zod.string().min(10, 'Valid phone number is required'),
  email: zod.string().email('Valid email is required'),
  dob: zod.string().min(1, 'DOB is required'),
  address: zod.string().min(5, 'Address is required'),
  licenseNumber: zod.string().min(6, 'License number is required'),
  licenseCategory: zod.enum(['Class A', 'Class B', 'Class C', 'Class D']),
  licenseExpiry: zod.string().min(1, 'License expiry is required'),
  experience: zod.number().min(0, 'Experience must be non-negative'),
  safetyScore: zod.number().min(0).max(100),
  status: zod.enum(['Active', 'On Leave', 'Suspended', 'Inactive']),
});

type DriverFields = zod.infer<typeof driverSchema>;

export default function DriverAdd() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DriverFields>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      licenseCategory: 'Class A',
      status: 'Active',
      safetyScore: 90,
      experience: 5,
    }
  });

  const safetyScoreVal = watch('safetyScore');

  const onSubmit = (data: DriverFields) => {
    console.log('Driver Saved:', data);
    setSuccess(true);
    setTimeout(() => {
      navigate('/drivers');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/drivers')}
          className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Register New Driver</h1>
          <p className="text-sm text-on-surface-variant">Add a new driver profile to the fleet roster.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Driver registered successfully! Returning to roster list...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Full Name *</label>
                <input 
                  {...register('name')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number *</label>
                <input 
                  {...register('phone')}
                  type="tel" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address *</label>
                <input 
                  {...register('email')}
                  type="email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Date of Birth *</label>
                <input 
                  {...register('dob')}
                  type="date" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                />
                {errors.dob && <p className="text-xs text-error mt-1">{errors.dob.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Residential Address *</label>
                <textarea 
                  {...register('address')}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                />
                {errors.address && <p className="text-xs text-error mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* License Details */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">License & Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">License Number *</label>
                <input 
                  {...register('licenseNumber')}
                  type="text" 
                  placeholder="e.g. MH-0320150034567"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.licenseNumber && <p className="text-xs text-error mt-1">{errors.licenseNumber.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">License Category *</label>
                <select 
                  {...register('licenseCategory')}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                >
                  <option value="Class A">Class A - Heavy Trucks</option>
                  <option value="Class B">Class B - Vans/Medium vehicles</option>
                  <option value="Class C">Class C - Light commercial cars</option>
                  <option value="Class D">Class D - Buses/Passenger carriers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">License Expiry Date *</label>
                <input 
                  {...register('licenseExpiry')}
                  type="date" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                />
                {errors.licenseExpiry && <p className="text-xs text-error mt-1">{errors.licenseExpiry.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Years of Experience *</label>
                <input 
                  {...register('experience', { valueAsNumber: true })}
                  type="number" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.experience && <p className="text-xs text-error mt-1">{errors.experience.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status & Safety Grid */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Fleet Settings</h3>
            
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Safety Score ({safetyScoreVal}/100)</label>
              <input 
                {...register('safetyScore', { valueAsNumber: true })}
                type="range" 
                min="0" 
                max="100"
                className="w-full accent-primary bg-surface-container-high h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Initial Status *</label>
              <select 
                {...register('status')}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* License Upload Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Documents Upload</h3>
            <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-outline mb-2" />
              <span className="text-xs font-semibold text-on-surface">Upload License Copy</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5">PDF or Image up to 5MB</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-3">
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors shadow-xs"
            >
              Save Driver
            </button>
            <button
              type="button"
              onClick={() => navigate('/drivers')}
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface py-3 rounded-xl font-medium hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
