import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Award, Star, UserCheck, ShieldAlert } from 'lucide-react';
import { drivers as initialDrivers } from '../data/mockData';
import { getStatusColor } from '../lib/utils';
import type { Driver } from '../types';
import { api } from '../lib/api';

export default function DriverList() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadDrivers() {
      try {
        const data = await api.drivers.getAll();
        setDrivers(data);
      } catch (err) {
        console.error('Failed to fetch drivers from backend API', err);
      }
    }
    loadDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || driver.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Driver Roster</h1>
          <p className="text-sm text-on-surface-variant">Manage driver profiles, verify licenses, and monitor safety ratings.</p>
        </div>
        <button
          onClick={() => navigate('/drivers/add')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Register Driver
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search driver by name or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid of Premium Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map(driver => (
            <div 
              key={driver.id} 
              onClick={() => navigate(`/drivers/${driver.id}`)}
              className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card top branding */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-base uppercase">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">{driver.name}</h3>
                    <span className="text-xs text-on-surface-variant font-medium">ID: {driver.id}</span>
                  </div>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>

              {/* Middle Metrics */}
              <div className="grid grid-cols-3 gap-2 border-y border-outline-variant/20 py-4 my-2 text-center">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Safety Score</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Award className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-on-surface">{driver.safetyScore}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Trips Done</span>
                  <span className="text-sm font-bold text-on-surface mt-1 block">{driver.totalTrips}</span>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Rating</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                    <span className="text-sm font-bold text-on-surface">{driver.rating}</span>
                  </div>
                </div>
              </div>

              {/* Bottom License compliance detail */}
              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 pt-2">
                <span>License: <span className="font-mono font-medium text-on-surface">{driver.licenseCategory}</span></span>
                <span>Expiry: <span className="font-medium text-on-surface">{driver.licenseExpiry}</span></span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-on-surface-variant font-medium">
            No driver profiles found.
          </div>
        )}
      </div>
    </div>
  );
}
