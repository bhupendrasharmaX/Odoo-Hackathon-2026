import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Navigation, Compass, AlertCircle, 
  MapPin, Printer, Check, Clock, TrendingUp, AlertTriangle, Truck, User 
} from 'lucide-react';
import { trips } from '../data/mockData';
import { formatCurrency, getStatusColor } from '../lib/utils';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-on-surface">Trip Shipment Not Found</h2>
        <button onClick={() => navigate('/trips')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl">
          Back to Trip Board
        </button>
      </div>
    );
  }

  // Vertical steps
  const steps = [
    { label: 'Created', done: true, date: 'Jul 12, 08:00 AM' },
    { label: 'Dispatched', done: true, date: 'Jul 12, 08:15 AM' },
    { label: 'In Transit', active: trip.status === 'In Transit', done: trip.status === 'Completed', date: 'Jul 12, 08:30 AM' },
    { label: 'Completed', active: trip.status === 'Completed', done: trip.status === 'Completed', date: trip.completedDate || 'Pending' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/trips')}
            className="p-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-on-background">Trip {trip.id}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant font-mono mt-0.5">{trip.source.split(',')[0]} → {trip.destination.split(',')[0]}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs">
            <Printer className="w-4 h-4 text-on-surface-variant" /> Print waybill
          </button>
          {trip.status !== 'Completed' && (
            <button 
              onClick={() => alert('Trip completed')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" /> Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Horizontal timeline stepper */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
        <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider text-on-surface-variant mb-6">Shipment Timeline Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                st.done ? 'bg-green-100 text-green-700' : st.active ? 'bg-primary text-white animate-pulse' : 'bg-surface-container text-on-surface-variant'
              }`}>
                {st.done ? '✓' : idx + 1}
              </div>
              <span className="text-sm font-bold text-on-surface mt-2">{st.label}</span>
              <span className="text-xs text-on-surface-variant mt-0.5">{st.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Details Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5 lg:col-span-2">
          <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" /> Route details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-on-surface-variant font-semibold block uppercase tracking-wider">Origin Location</span>
                  <span className="text-sm font-semibold">{trip.source}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-on-surface-variant font-semibold block uppercase tracking-wider">Destination Location</span>
                  <span className="text-sm font-semibold">{trip.destination}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-surface-container-low/30 p-4 rounded-xl text-sm">
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Distance</span>
                <span className="font-bold">{trip.distance} km</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Cargo Category</span>
                <span className="font-bold">{trip.cargoType}</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Weight load</span>
                <span className="font-bold">{trip.cargoWeight} Tons</span>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant block font-medium">Billable Value</span>
                <span className="font-bold">{formatCurrency(trip.revenue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Drivers / Vehicles */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Operational Assignments</h3>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Assigned Truck</span>
                <span className="text-sm font-bold text-on-surface">{trip.vehicleName} ({trip.vehicleId})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold block">Driver on Duty</span>
                <span className="text-sm font-bold text-on-surface">{trip.driverName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
