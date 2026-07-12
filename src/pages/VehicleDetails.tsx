import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Shield, Calendar, Fuel, Route, Wrench, 
  Receipt, Clock, Info, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { vehicles, trips, maintenanceRecords, fuelLogs, expenses } from '../data/mockData';
import { formatCurrency, formatNumber, getStatusColor } from '../lib/utils';

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'fuel' | 'maintenance' | 'expenses'>('overview');

  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-on-surface">Vehicle Not Found</h2>
        <p className="text-sm text-on-surface-variant mt-2">The vehicle with ID {id} does not exist or has been deleted.</p>
        <button onClick={() => navigate('/vehicles')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl">
          Back to Fleet List
        </button>
      </div>
    );
  }

  // Filter lists matching this vehicle
  const vehicleTrips = trips.filter(t => t.vehicleId === vehicle.id);
  const vehicleMnt = maintenanceRecords.filter(m => m.vehicleId === vehicle.id);
  const vehicleFuel = fuelLogs.filter(f => f.vehicleId === vehicle.id);
  const vehicleExpenses = expenses.filter(e => e.vehicleId === vehicle.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/vehicles')}
            className="p-2 rounded-xl border border-outline-variant bg-white text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-on-background">{vehicle.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant font-mono mt-0.5">{vehicle.registrationNumber} • {vehicle.type}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => alert('Edit Vehicle logic')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs"
          >
            <Edit className="w-4 h-4 text-on-surface-variant" /> Edit
          </button>
          <button 
            onClick={() => {
              if (confirm('Delete this vehicle?')) {
                navigate('/vehicles');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-outline-variant/40 flex gap-2 overflow-x-auto">
        {(['overview', 'trips', 'fuel', 'maintenance', 'expenses'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all capitalize whitespace-nowrap ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Details column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specs Card */}
            <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
              <h3 className="font-bold text-on-surface text-base mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Make/Model</span>
                  <span className="font-medium text-on-surface">{vehicle.name}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Registration Number</span>
                  <span className="font-medium text-on-surface font-mono">{vehicle.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Capacity</span>
                  <span className="font-medium text-on-surface">{vehicle.capacity} Tons</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Manufacture Year</span>
                  <span className="font-medium text-on-surface">{vehicle.yearOfManufacture}</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Current Odometer</span>
                  <span className="font-medium text-on-surface">{formatNumber(vehicle.odometer)} km</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase tracking-wider font-semibold">Insurance Expiry</span>
                  <span className="font-medium text-on-surface">{vehicle.insuranceExpiry}</span>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
              <h3 className="font-bold text-on-surface text-base mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Vehicle Timeline
              </h3>
              <div className="relative pl-6 border-l-2 border-outline-variant/40 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                  <div className="text-xs text-on-surface-variant">Today</div>
                  <div className="text-sm font-semibold">Scheduled for Engine Diagnostic</div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Assigned to Suresh Patel</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                  <div className="text-xs text-on-surface-variant">2 days ago</div>
                  <div className="text-sm font-semibold">Completed Trip TR-8801</div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Delhi to Jaipur route (281 km)</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                  <div className="text-xs text-on-surface-variant">July 5, 2026</div>
                  <div className="text-sm font-semibold">Routine maintenance completed</div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Engine oil replaced (Cost: {formatCurrency(4200)})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div className="space-y-6">
            <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Financial Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Purchase Price</span>
                  <span className="text-sm font-bold text-on-surface">{formatCurrency(vehicle.purchaseCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Total Trips MTD</span>
                  <span className="text-sm font-bold text-on-surface">{vehicleTrips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Total Fuel Cost MTD</span>
                  <span className="text-sm font-bold text-on-surface">
                    {formatCurrency(vehicleFuel.reduce((sum, item) => sum + item.totalCost, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">Total Maintenance MTD</span>
                  <span className="text-sm font-bold text-on-surface">
                    {formatCurrency(vehicleMnt.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost), 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs text-center space-y-2">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Odometer Benchmark</span>
              <div className="text-3xl font-black text-primary">{formatNumber(vehicle.odometer)} km</div>
              <p className="text-xs text-on-surface-variant">Last updated on Jul 12, 2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Trips list tab */}
      {activeTab === 'trips' && (
        <div className="bg-white border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-4 px-6">Trip ID</th>
                  <th className="py-4 px-6">Route</th>
                  <th className="py-4 px-6">Driver</th>
                  <th className="py-4 px-6">Cargo</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {vehicleTrips.length > 0 ? (
                  vehicleTrips.map(trip => (
                    <tr key={trip.id} className="hover:bg-surface-container-lowest/50 transition-colors cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                      <td className="py-4 px-6 font-semibold text-primary">{trip.id}</td>
                      <td className="py-4 px-6">{trip.source.split(',')[0]} → {trip.destination.split(',')[0]}</td>
                      <td className="py-4 px-6">{trip.driverName}</td>
                      <td className="py-4 px-6">{trip.cargoType} ({trip.cargoWeight} tons)</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">No trip logs associated with this vehicle.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fuel logs tab */}
      {activeTab === 'fuel' && (
        <div className="bg-white border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Driver</th>
                  <th className="py-4 px-6">Quantity (L)</th>
                  <th className="py-4 px-6">Rate (₹)</th>
                  <th className="py-4 px-6">Total Cost</th>
                  <th className="py-4 px-6">Station</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {vehicleFuel.length > 0 ? (
                  vehicleFuel.map(fuel => (
                    <tr key={fuel.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-6 text-on-surface-variant">{fuel.date}</td>
                      <td className="py-4 px-6">{fuel.driverName}</td>
                      <td className="py-4 px-6">{fuel.quantity} L</td>
                      <td className="py-4 px-6">₹{fuel.costPerLiter}</td>
                      <td className="py-4 px-6 font-semibold">{formatCurrency(fuel.totalCost)}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{fuel.station}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-on-surface-variant">No fuel logs recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance tab */}
      {activeTab === 'maintenance' && (
        <div className="bg-white border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Service Type</th>
                  <th className="py-4 px-6">Scheduled Date</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Mechanic</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {vehicleMnt.length > 0 ? (
                  vehicleMnt.map(mnt => (
                    <tr key={mnt.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-primary">{mnt.id}</td>
                      <td className="py-4 px-6">{mnt.type}</td>
                      <td className="py-4 px-6 text-on-surface-variant">{mnt.scheduledDate}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-${
                          mnt.priority === 'Urgent' ? 'red-100 text-red-800' : 'blue-100 text-blue-800'
                        }`}>
                          {mnt.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6">{mnt.mechanic}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(mnt.status)}`}>
                          {mnt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-on-surface-variant">No maintenance history.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses tab */}
      {activeTab === 'expenses' && (
        <div className="bg-white border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Amount (₹)</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {vehicleExpenses.length > 0 ? (
                  vehicleExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="py-4 px-6 text-on-surface-variant">{exp.date}</td>
                      <td className="py-4 px-6 font-semibold">{exp.category}</td>
                      <td className="py-4 px-6">{exp.description}</td>
                      <td className="py-4 px-6 font-bold">{formatCurrency(exp.amount)}</td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">No expenses logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
