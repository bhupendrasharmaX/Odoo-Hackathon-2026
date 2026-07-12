import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Plus, Search, Calendar, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { maintenanceRecords as initialMnt, vehicles } from '../data/mockData';
import { formatCurrency, getStatusColor, getPriorityColor } from '../lib/utils';
import type { Maintenance } from '../types';
import { api } from '../lib/api';

const mntSchema = zod.object({
  vehicleId: zod.string().min(1, 'Vehicle is required'),
  type: zod.string().min(2, 'Maintenance type is required'),
  description: zod.string().min(5, 'Description is required'),
  priority: zod.enum(['Low', 'Medium', 'High', 'Urgent']),
  scheduledDate: zod.string().min(1, 'Date is required'),
  estimatedCost: zod.number().min(0),
  mechanic: zod.string().min(2, 'Mechanic name is required'),
});

type MntFields = zod.infer<typeof mntSchema>;

export default function MaintenanceList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Maintenance[]>(initialMnt);
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const [realVehicles, setRealVehicles] = useState<any[]>(vehicles);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.maintenance.getAll();
        setRecords(data);
        const vData = await api.vehicles.getAll();
        setRealVehicles(vData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    }
    loadData();
  }, []);

  // Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MntFields>({
    resolver: zodResolver(mntSchema),
    defaultValues: {
      priority: 'Medium',
      estimatedCost: 5000,
    }
  });

  const onSubmit = async (data: MntFields) => {
    try {
      const v = realVehicles.find(item => item.id === data.vehicleId);
      const payload = {
        vehicleId: data.vehicleId,
        title: data.type,
        description: data.description,
        priority: data.priority,
        status: 'SCHEDULED',
        startDate: data.scheduledDate,
        cost: data.estimatedCost,
        mechanic: data.mechanic,
      };
      
      const newRecord = await api.maintenance.create(payload);
      setRecords([newRecord, ...records]);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowCreateModal(false);
        reset();
      }, 1200);
    } catch (err) {
      console.error('Failed to create maintenance record:', err);
      alert('Error saving maintenance record to database');
    }
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = 
      rec.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      rec.type.toLowerCase().includes(search.toLowerCase()) ||
      rec.mechanic.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || rec.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Maintenance Logs</h1>
          <p className="text-sm text-on-surface-variant">Schedule diagnostics, check inspections, and track repairs.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Schedule Maintenance
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search vehicle, type, mechanic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Maintenance Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Maintenance Details</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Scheduled Date</th>
                <th className="py-4 px-6 text-right">Est. Cost</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/20">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-primary">{rec.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-on-surface">{rec.vehicleId}</div>
                      <span className="text-xs text-on-surface-variant">{rec.vehicleName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface">{rec.type}</div>
                      <span className="text-xs text-on-surface-variant">Mech: {rec.mechanic}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{rec.scheduledDate}</td>
                    <td className="py-4 px-6 text-right font-semibold">{formatCurrency(rec.estimatedCost)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">No maintenance logs matches search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Maintenance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scale-in">
            {success && (
              <div className="absolute inset-0 bg-surface-container-lowest/95 flex flex-col items-center justify-center z-20">
                <CheckCircle className="w-12 h-12 text-green-600 animate-bounce mb-3" />
                <span className="font-bold text-on-surface">Maintenance scheduled successfully!</span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-4">
              <h3 className="font-bold text-on-surface text-lg">Schedule Maintenance Work Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-on-surface text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Select Vehicle *</label>
                  <select 
                    {...register('vehicleId')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="">Select vehicle</option>
                    {realVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.id} - {v.vehicleName || v.name}</option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-xs text-error mt-0.5">{errors.vehicleId.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Service Type *</label>
                  <input 
                    {...register('type')}
                    type="text" 
                    placeholder="e.g. Oil Change"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.type && <p className="text-xs text-error mt-0.5">{errors.type.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Description *</label>
                <textarea 
                  {...register('description')}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none resize-none"
                />
                {errors.description && <p className="text-xs text-error mt-0.5">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Priority *</label>
                  <select 
                    {...register('priority')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Scheduled Date *</label>
                  <input 
                    {...register('scheduledDate')}
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.scheduledDate && <p className="text-xs text-error mt-0.5">{errors.scheduledDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Estimated Cost (INR) *</label>
                  <input 
                    {...register('estimatedCost', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Assign Mechanic *</label>
                  <input 
                    {...register('mechanic')}
                    type="text" 
                    placeholder="e.g. Suresh Patel"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.mechanic && <p className="text-xs text-error mt-0.5">{errors.mechanic.message}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-medium hover:bg-primary/95 transition-colors">
                  Schedule
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface py-2.5 rounded-xl font-medium hover:bg-surface-container-low transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
