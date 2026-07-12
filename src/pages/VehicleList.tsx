import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Trash2, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { vehicles as initialVehicles } from '../data/mockData';
import { formatCurrency, formatNumber, getStatusColor } from '../lib/utils';
import type { Vehicle, VehicleStatus, VehicleType } from '../types';
import { api } from '../lib/api';

export default function VehicleList() {
  const navigate = useNavigate();
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Vehicle>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await api.vehicles.getAll();
        setVehiclesList(data);
      } catch (err) {
        console.error('Failed to fetch vehicles from backend API', err);
      }
    }
    loadVehicles();
  }, []);

  // Filter
  const filteredVehicles = vehiclesList.filter((vehicle) => {
    const matchesSearch = 
      vehicle.id.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || vehicle.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || vehicle.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete vehicle ${id}?`)) {
      setVehiclesList(vehiclesList.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Vehicle Fleet</h1>
          <p className="text-sm text-on-surface-variant">Manage, search, and view maintenance status of all registered vehicles.</p>
        </div>
        <button
          onClick={() => navigate('/vehicles/add')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search reg number, model name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-outline" /> Filters:
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
          >
            <option value="All">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
            <option value="Car">Car</option>
            <option value="Trailer">Trailer</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Available">Available</option>
            <option value="In Maintenance">In Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table Card */}
      <div className="bg-white border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-4 px-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('id')}>
                  Vehicle ID <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                  Model & Registration <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('type')}>
                  Type <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('odometer')}>
                  Odometer <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('purchaseCost')}>
                  Value <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/20">
              {sortedVehicles.length > 0 ? (
                sortedVehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id} 
                    className="hover:bg-surface-container-lowest/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  >
                    <td className="py-4 px-6 font-semibold text-primary">{vehicle.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-on-surface">{vehicle.name}</div>
                      <span className="text-xs text-on-surface-variant font-mono">{vehicle.registrationNumber}</span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">{vehicle.type}</td>
                    <td className="py-4 px-6 font-medium">{formatNumber(vehicle.odometer)} km</td>
                    <td className="py-4 px-6 text-on-surface-variant">{formatCurrency(vehicle.purchaseCost)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(vehicle.id, e)}
                          className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-red-50 transition-colors"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant font-medium">
                    No vehicles found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="border-t border-outline-variant/30 py-3.5 px-6 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low/20">
          <span>Showing 1 to {sortedVehicles.length} of {sortedVehicles.length} vehicles</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded-lg border border-outline-variant bg-white disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
