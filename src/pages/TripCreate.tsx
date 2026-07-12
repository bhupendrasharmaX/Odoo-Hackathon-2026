import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, MapPin, Truck, 
  User, DollarSign, Package, Compass, Layers 
} from 'lucide-react';
import { vehicles, drivers } from '../data/mockData';
import { api } from '../lib/api';

const step1Schema = zod.object({
  source: zod.string().min(3, 'Source location is required'),
  destination: zod.string().min(3, 'Destination is required'),
});

const step2Schema = zod.object({
  vehicleId: zod.string().min(1, 'Please select a vehicle'),
  driverId: zod.string().min(1, 'Please select a driver'),
});

const step3Schema = zod.object({
  cargoType: zod.string().min(2, 'Cargo type is required'),
  cargoWeight: zod.number().min(0.1, 'Weight must be greater than 0'),
  distance: zod.number().min(1, 'Distance is required'),
  revenue: zod.number().min(100, 'Revenue is required'),
});

export default function TripCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [realVehicles, setRealVehicles] = useState<any[]>(vehicles);
  const [realDrivers, setRealDrivers] = useState<any[]>(drivers);

  useEffect(() => {
    async function loadData() {
      try {
        const vData = await api.vehicles.getAll();
        setRealVehicles(vData);
        const dData = await api.drivers.getAll();
        setRealDrivers(dData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    }
    loadData();
  }, []);

  // Forms
  const { register: reg1, handleSubmit: val1, formState: { errors: err1 } } = useForm<zod.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
  });
  const { register: reg2, handleSubmit: val2, formState: { errors: err2 } } = useForm<zod.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
  });
  const { register: reg3, handleSubmit: val3, formState: { errors: err3 } } = useForm<zod.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
  });

  const nextStep1 = (data: any) => {
    setTripData({ ...tripData, ...data });
    setStep(2);
  };

  const nextStep2 = (data: any) => {
    setTripData({ ...tripData, ...data });
    setStep(3);
  };

  const nextStep3 = (data: any) => {
    setTripData({ ...tripData, ...data });
    setStep(4);
  };

  const handleDispatch = async () => {
    try {
      const payload = {
        vehicleId: tripData.vehicleId,
        driverId: tripData.driverId,
        source: tripData.source,
        destination: tripData.destination,
        cargoType: tripData.cargoType,
        cargoWeight: tripData.cargoWeight,
        plannedDistance: tripData.distance,
        revenue: tripData.revenue,
      };
      await api.trips.create(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/trips');
      }, 1500);
    } catch (err) {
      console.error('Failed to create trip:', err);
      alert('Error saving trip to database');
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === tripData.vehicleId);
  const selectedDriver = drivers.find(d => d.id === tripData.driverId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else navigate('/trips');
          }}
          className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Create Trip Dispatch</h1>
          <p className="text-sm text-on-surface-variant">Step {step} of 4: Setup details and dispatch assets.</p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex justify-between items-center gap-2 max-w-3xl mx-auto">
        {[
          { num: 1, label: 'Route' },
          { num: 2, label: 'Assets' },
          { num: 3, label: 'Cargo & Billing' },
          { num: 4, label: 'Summary' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step === s.num ? 'bg-primary text-on-primary' : step > s.num ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'
            }`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-primary' : 'text-on-surface-variant'}`}>{s.label}</span>
            {s.num < 4 && <ChevronRight className="w-4 h-4 text-outline hidden sm:block" />}
          </div>
        ))}
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 flex items-center gap-3 animate-fade-in max-w-2xl mx-auto">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Trip dispatched successfully! Redirecting to tracking view...</span>
        </div>
      )}

      {/* Wizard Steps */}
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <form onSubmit={val1(nextStep1)} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5 animate-fade-in">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Define Shipment Route
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Source Location *</label>
                <input 
                  {...reg1('source')}
                  type="text" 
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err1.source && <p className="text-xs text-error mt-1">{err1.source.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Destination Location *</label>
                <input 
                  {...reg1('destination')}
                  type="text" 
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err1.destination && <p className="text-xs text-error mt-1">{err1.destination.message}</p>}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors mt-2 flex items-center justify-center gap-1">
              Select Assets <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={val2(nextStep2)} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5 animate-fade-in">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Assign Fleet Assets
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Select Vehicle *</label>
                <select 
                  {...reg2('vehicleId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                >
                  <option value="">Select vehicle</option>
                  {realVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.id} - {v.vehicleName || v.name}</option>
                  ))}
                </select>
                {err2.vehicleId && <p className="text-xs text-error mt-1">{err2.vehicleId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Select Driver *</label>
                <select 
                  {...reg2('driverId')}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary outline-none"
                >
                  <option value="">Select driver</option>
                  {realDrivers.map(d => (
                    <option key={d.id} value={d.id}>{d.id} - {d.name}</option>
                  ))}
                </select>
                {err2.driverId && <p className="text-xs text-error mt-1">{err2.driverId.message}</p>}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors mt-2 flex items-center justify-center gap-1">
              Add Cargo & Billing <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={val3(nextStep3)} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5 animate-fade-in">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Cargo & Billing Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Cargo Type *</label>
                <input 
                  {...reg3('cargoType')}
                  type="text" 
                  placeholder="e.g. Electronics, Steel coils"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err3.cargoType && <p className="text-xs text-error mt-1">{err3.cargoType.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Cargo Weight (Tons) *</label>
                <input 
                  {...reg3('cargoWeight', { valueAsNumber: true })}
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 8.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err3.cargoWeight && <p className="text-xs text-error mt-1">{err3.cargoWeight.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Estimated Distance (km) *</label>
                <input 
                  {...reg3('distance', { valueAsNumber: true })}
                  type="number" 
                  placeholder="e.g. 150"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err3.distance && <p className="text-xs text-error mt-1">{err3.distance.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Estimated Revenue (INR) *</label>
                <input 
                  {...reg3('revenue', { valueAsNumber: true })}
                  type="number" 
                  placeholder="e.g. 25000"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
                {err3.revenue && <p className="text-xs text-error mt-1">{err3.revenue.message}</p>}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors mt-2 flex items-center justify-center gap-1">
              Review Dispatch Summary <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Review Dispatch Sheet
            </h3>

            <div className="divide-y divide-outline-variant/20 text-sm space-y-3">
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant">Route</span>
                <span className="font-semibold">{tripData.source} → {tripData.destination}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant">Vehicle</span>
                <span className="font-semibold">{selectedVehicle?.id} - {selectedVehicle?.name}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant">Driver</span>
                <span className="font-semibold">{selectedDriver?.name} (Score: {selectedDriver?.safetyScore})</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant">Cargo</span>
                <span className="font-semibold">{tripData.cargoType} ({tripData.cargoWeight} Tons)</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant">Est. Distance</span>
                <span className="font-semibold">{tripData.distance} km</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-on-surface-variant text-primary font-bold">Total Est. Revenue</span>
                <span className="font-extrabold text-on-surface text-base">₹{tripData.revenue?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleDispatch}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium hover:bg-primary/95 transition-colors mt-2"
            >
              Confirm Dispatch Shipment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
