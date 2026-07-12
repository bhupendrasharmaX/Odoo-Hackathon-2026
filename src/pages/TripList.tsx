import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, ArrowRight, Clock, MapPin, Truck, User } from 'lucide-react';
import { trips as initialTrips } from '../data/mockData';
import { formatCurrency, getStatusColor } from '../lib/utils';
import type { Trip } from '../types';
import { api } from '../lib/api';

export default function TripList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await api.trips.getAll();
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch trips from backend API', err);
      }
    }
    loadTrips();
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(search.toLowerCase()) ||
      trip.source.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || trip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Trip Shipments</h1>
          <p className="text-sm text-on-surface-variant">Track shipments, dispatch schedules, and review routes.</p>
        </div>
        <button
          onClick={() => navigate('/trips/create')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Trip
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search destination, trip ID, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trip List Stack */}
      <div className="space-y-4">
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <div 
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs hover:border-primary/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Left Column: ID & Source/Destination Route */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{trip.id}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <MapPin className="w-4 h-4 text-primary" /> {trip.source.split(',')[0]}
                  </div>
                  <ArrowRight className="w-4 h-4 text-outline" />
                  <div className="flex items-center gap-1.5 font-semibold text-on-surface">
                    <MapPin className="w-4 h-4 text-error" /> {trip.destination.split(',')[0]}
                  </div>
                </div>
              </div>

              {/* Middle Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Truck className="w-4 h-4 text-outline" />
                  <span>{trip.vehicleName}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <User className="w-4 h-4 text-outline" />
                  <span>{trip.driverName}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant col-span-2 md:col-span-1">
                  <Clock className="w-4 h-4 text-outline" />
                  <span>Start: {trip.startDate}</span>
                </div>
              </div>

              {/* Right Column: Values & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-outline-variant/10 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold">Revenue</span>
                  <span className="text-base font-extrabold text-on-surface">{formatCurrency(trip.revenue)}</span>
                </div>
                <button
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="p-2 rounded-xl bg-surface-container-low text-primary hover:bg-primary hover:text-white transition-colors self-end md:self-auto"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-12 text-center text-on-surface-variant font-medium">
            No active trips matched parameters.
          </div>
        )}
      </div>
    </div>
  );
}
