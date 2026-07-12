import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ArrowLeft, UploadCloud, FileText, CheckCircle, X } from 'lucide-react';
import { api } from '../lib/api';

const vehicleSchema = zod.object({
  registrationNumber: zod.string().min(4, 'Registration number is required'),
  name: zod.string().min(2, 'Vehicle name is required'),
  model: zod.string().min(2, 'Model is required'),
  type: zod.enum(['Truck', 'Van', 'Bus', 'Car', 'Trailer']),
  capacity: zod.number().min(0.1, 'Capacity must be greater than 0'),
  yearOfManufacture: zod.number().min(1900).max(new Date().getFullYear() + 1),
  odometer: zod.number().min(0, 'Odometer must be positive'),
  purchaseCost: zod.number().min(0, 'Purchase cost must be positive'),
  insuranceExpiry: zod.string().min(1, 'Insurance expiry date is required'),
  status: zod.enum(['Active', 'Available', 'In Maintenance', 'Retired']),
});

type VehicleFields = zod.infer<typeof vehicleSchema>;

export default function VehicleAdd() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; preview: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFields>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'Truck',
      status: 'Available',
      yearOfManufacture: 2026,
      odometer: 0,
    }
  });

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (uploadedFile?.preview) {
        URL.revokeObjectURL(uploadedFile.preview);
      }
    };
  }, [uploadedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeInMB} MB`,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFile({
        name: file.name,
        size: `${sizeInMB} MB`,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: VehicleFields) => {
    try {
      let mappedStatus = 'AVAILABLE';
      if (data.status === 'In Maintenance') mappedStatus = 'IN_SHOP';
      else if (data.status === 'Retired') mappedStatus = 'RETIRED';

      const payload = {
        registrationNumber: data.registrationNumber,
        vehicleName: data.name,
        model: data.model,
        vehicleType: data.type.toUpperCase(),
        maximumCapacity: data.capacity,
        odometer: data.odometer,
        purchaseCost: data.purchaseCost,
        status: mappedStatus,
        insuranceExpiry: new Date(data.insuranceExpiry).toISOString(),
        yearOfManufacture: data.yearOfManufacture,
      };
      
      await api.vehicles.create(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/vehicles');
      }, 1500);
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      alert('Error saving vehicle to database');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/vehicles')}
          className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Add New Vehicle</h1>
          <p className="text-sm text-on-surface-variant">Register a new vehicle to your fleet.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Vehicle registered successfully! Redirecting to fleet list...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Vehicle Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Registration Number *</label>
                <input 
                  {...register('registrationNumber')}
                  type="text" 
                  placeholder="e.g. MH-01-AB-1234"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.registrationNumber && <p className="text-xs text-error mt-1">{errors.registrationNumber.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Vehicle Name / Make *</label>
                <input 
                  {...register('name')}
                  type="text" 
                  placeholder="e.g. Tata Prima 4928"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Model *</label>
                <input 
                  {...register('model')}
                  type="text" 
                  placeholder="e.g. Prima 4928.S"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.model && <p className="text-xs text-error mt-1">{errors.model.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Vehicle Type *</label>
                <select 
                  {...register('type')}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="Car">Car</option>
                  <option value="Trailer">Trailer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Capacity (Tons) *</label>
                <input 
                  {...register('capacity', { valueAsNumber: true })}
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 28"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.capacity && <p className="text-xs text-error mt-1">{errors.capacity.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Year of Manufacture *</label>
                <input 
                  {...register('yearOfManufacture', { valueAsNumber: true })}
                  type="number" 
                  placeholder="e.g. 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.yearOfManufacture && <p className="text-xs text-error mt-1">{errors.yearOfManufacture.message}</p>}
              </div>
            </div>
          </div>

          {/* Financial & Status Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Financial & Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Purchase Cost (INR) *</label>
                <input 
                  {...register('purchaseCost', { valueAsNumber: true })}
                  type="number" 
                  placeholder="e.g. 3200000"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.purchaseCost && <p className="text-xs text-error mt-1">{errors.purchaseCost.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Current Odometer (km) *</label>
                <input 
                  {...register('odometer', { valueAsNumber: true })}
                  type="number" 
                  placeholder="e.g. 10000"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {errors.odometer && <p className="text-xs text-error mt-1">{errors.odometer.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Initial Status *</label>
                <select 
                  {...register('status')}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Available">Available</option>
                  <option value="In Maintenance">In Maintenance</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Insurance Expiry Date *</label>
                <input 
                  {...register('insuranceExpiry')}
                  type="date" 
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                />
                {errors.insuranceExpiry && <p className="text-xs text-error mt-1">{errors.insuranceExpiry.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image and Actions */}
        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Vehicle Photo</h3>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileChange}
            />
            
            {!uploadedFile ? (
              <div 
                onClick={onUploadClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/20'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-outline mb-3" />
                <span className="text-sm font-semibold text-on-surface">Drag & drop or click to upload</span>
                <span className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG up to 5MB</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative border border-outline-variant/60 rounded-2xl overflow-hidden aspect-video bg-surface-container-low">
                  <img 
                    src={uploadedFile.preview} 
                    alt="Vehicle preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{uploadedFile.name}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{uploadedFile.size}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-3">
            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors shadow-xs"
            >
              Save Vehicle
            </button>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
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
