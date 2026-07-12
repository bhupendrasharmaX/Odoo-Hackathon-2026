import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Search, CheckCircle, Fuel, Compass, AlertCircle, DollarSign, ListFilter } from 'lucide-react';
import { fuelLogs as initialFuelLogs, vehicles, chartData } from '../data/mockData';
import { formatCurrency, formatNumber } from '../lib/utils';
import type { FuelLog } from '../types';
import { api } from '../lib/api';

const fuelSchema = zod.object({
  vehicleId: zod.string().min(1, 'Vehicle is required'),
  driverName: zod.string().min(2, 'Driver name is required'),
  date: zod.string().min(1, 'Date is required'),
  fuelType: zod.enum(['Diesel', 'Petrol', 'CNG', 'Electric']),
  quantity: zod.number().min(0.1, 'Quantity must be positive'),
  costPerLiter: zod.number().min(1, 'Cost per liter is required'),
  odometer: zod.number().min(0, 'Odometer must be positive'),
  station: zod.string().min(2, 'Station name is required'),
});

type FuelFields = zod.infer<typeof fuelSchema>;

export default function FuelList() {
  const [logs, setLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadFuel() {
      try {
        const data = await api.fuel.getAll();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch fuel logs', err);
      }
    }
    loadFuel();
  }, []);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FuelFields>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      fuelType: 'Diesel',
      date: new Date().toISOString().split('T')[0],
      quantity: 50,
      costPerLiter: 90,
    }
  });

  const qty = watch('quantity') || 0;
  const rate = watch('costPerLiter') || 0;
  const totalCostVal = qty * rate;

  const onSubmit = (data: FuelFields) => {
    const v = vehicles.find(item => item.id === data.vehicleId);
    const newLog: FuelLog = {
      id: `FL-${1000 + logs.length + 1}`,
      vehicleId: data.vehicleId,
      vehicleName: v ? v.name : 'Unknown',
      driverName: data.driverName,
      date: data.date,
      fuelType: data.fuelType,
      quantity: data.quantity,
      costPerLiter: data.costPerLiter,
      totalCost: data.quantity * data.costPerLiter,
      odometer: data.odometer,
      station: data.station,
    };
    setLogs([newLog, ...logs]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
      reset();
    }, 1200);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
      log.driverName.toLowerCase().includes(search.toLowerCase()) ||
      log.station.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Fuel Management</h1>
          <p className="text-sm text-on-surface-variant">Track fleet fuel consumption, fuel stations, and efficiency indices.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Fuel Log
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Total Fuel Cost MTD</span>
          <div className="text-2xl font-black text-on-surface mt-2">{formatCurrency(342000)}</div>
          <span className="text-[10px] text-red-600 font-semibold block mt-1">+5.2% vs last month</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Fuel Consumed MTD</span>
          <div className="text-2xl font-black text-on-surface mt-2">8,450 L</div>
          <span className="text-[10px] text-on-surface-variant block mt-1">Avg 272L per vehicle</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Avg Fuel Rate</span>
          <div className="text-2xl font-black text-on-surface mt-2">₹89.80 / L</div>
          <span className="text-[10px] text-on-surface-variant block mt-1">Stabilized rate index</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Fleet Efficiency</span>
          <div className="text-2xl font-black text-green-600 mt-2">4.2 km / L</div>
          <span className="text-[10px] text-green-600 font-semibold block mt-1">+1.8% efficiency up</span>
        </div>
      </div>

      {/* Fuel cost trend area chart */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[300px] flex flex-col justify-between">
        <h3 className="font-bold text-on-surface text-base mb-2">Monthly Fuel Cost Trend</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.fuelTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDiesel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0061ff" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0061ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.2} />
              <XAxis dataKey="month" stroke="var(--color-outline)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-outline)" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '12px' }} labelStyle={{ color: 'var(--color-on-surface)' }} itemStyle={{ color: 'var(--color-on-surface)' }} formatter={(value: any) => [formatCurrency(Number(value)), '']} />
              <Area type="monotone" dataKey="diesel" stroke="#0061ff" strokeWidth={2} fillOpacity={1} fill="url(#colorDiesel)" name="Diesel Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters and search logs */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search vehicle ID, station name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Driver</th>
                <th className="py-4 px-6">Fuel Type</th>
                <th className="py-4 px-6">Quantity</th>
                <th className="py-4 px-6">Odometer</th>
                <th className="py-4 px-6 text-right">Total Cost</th>
                <th className="py-4 px-6">Station / Location</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/20">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="py-4 px-6 text-on-surface-variant">{log.date}</td>
                    <td className="py-4 px-6 font-semibold text-on-surface">
                      <div>{log.vehicleId}</div>
                      <span className="text-xs text-on-surface-variant">{log.vehicleName}</span>
                    </td>
                    <td className="py-4 px-6">{log.driverName}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-800 font-bold uppercase tracking-wider">
                        {log.fuelType}
                      </span>
                    </td>
                    <td className="py-4 px-6">{log.quantity} L <span className="text-xs text-on-surface-variant">@ ₹{log.costPerLiter}</span></td>
                    <td className="py-4 px-6 font-mono text-xs">{formatNumber(log.odometer)} km</td>
                    <td className="py-4 px-6 text-right font-extrabold text-on-surface">{formatCurrency(log.totalCost)}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{log.station}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">No fuel log entries match parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Fuel Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scale-in">
            {success && (
              <div className="absolute inset-0 bg-surface-container-lowest/95 flex flex-col items-center justify-center z-20">
                <CheckCircle className="w-12 h-12 text-green-600 animate-bounce mb-3" />
                <span className="font-bold text-on-surface">Fuel Log Entry Recorded!</span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-4">
              <h3 className="font-bold text-on-surface text-lg">Record Fuel Transaction Entry</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Select Vehicle *</label>
                  <select 
                    {...register('vehicleId')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="">Choose vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.id} - {v.name}</option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-xs text-error mt-0.5">{errors.vehicleId.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Driver Name *</label>
                  <input 
                    {...register('driverName')}
                    type="text"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.driverName && <p className="text-xs text-error mt-0.5">{errors.driverName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Date *</label>
                  <input 
                    {...register('date')}
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Fuel Type *</label>
                  <select 
                    {...register('fuelType')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Odometer (km) *</label>
                  <input 
                    {...register('odometer', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.odometer && <p className="text-xs text-error mt-0.5">{errors.odometer.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Quantity (Liters) *</label>
                  <input 
                    {...register('quantity', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.quantity && <p className="text-xs text-error mt-0.5">{errors.quantity.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Rate (₹ / Liter) *</label>
                  <input 
                    {...register('costPerLiter', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.costPerLiter && <p className="text-xs text-error mt-0.5">{errors.costPerLiter.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Calculated Cost (INR)</label>
                  <div className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 text-sm bg-surface-container-low font-bold">
                    ₹{totalCostVal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Station Name *</label>
                  <input 
                    {...register('station')}
                    type="text"
                    placeholder="e.g. Indian Oil, Andheri"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.station && <p className="text-xs text-error mt-0.5">{errors.station.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Location/Remarks</label>
                  <input 
                    type="text"
                    placeholder="e.g. Highway NH-8"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-medium hover:bg-primary/95 transition-colors">
                  Record Log
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface py-2.5 rounded-xl font-medium hover:bg-surface-container-low transition-colors">
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
