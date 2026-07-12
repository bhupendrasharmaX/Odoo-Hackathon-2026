import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Edit, Phone, Mail, Calendar, Shield, Award, Route, 
  Clock, CheckCircle2, AlertTriangle, Star 
} from 'lucide-react';
import { drivers, trips, chartData } from '../data/mockData';
import { getStatusColor } from '../lib/utils';

export default function DriverDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const driver = drivers.find(d => d.id === id);

  if (!driver) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-on-surface">Driver Profile Not Found</h2>
        <button onClick={() => navigate('/drivers')} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl">
          Back to Driver List
        </button>
      </div>
    );
  }

  const driverTrips = trips.filter(t => t.driverId === driver.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/drivers')}
            className="p-2 rounded-xl border border-outline-variant bg-white text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-on-background">{driver.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                {driver.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant font-mono mt-0.5">ID: {driver.id} • {driver.licenseCategory} Driver</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Edit profile')} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button onClick={() => navigate('/trips/create')} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors shadow-xs">
            <Route className="w-4 h-4" /> Assign Trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Driver Info Card */}
        <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-3xl mb-3">
              {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-xl font-bold text-on-surface">{driver.name}</h2>
            <span className="text-sm text-on-surface-variant font-medium">Senior Fleet Operator</span>
          </div>

          <div className="space-y-4 border-t border-outline-variant/20 pt-6">
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Phone className="w-4 h-4 text-outline" />
              <span>{driver.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Mail className="w-4 h-4 text-outline" />
              <span>{driver.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Calendar className="w-4 h-4 text-outline" />
              <span>Joined: {driver.joinedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Shield className="w-4 h-4 text-outline" />
              <span>License: <span className="font-mono">{driver.licenseNumber}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Clock className="w-4 h-4 text-outline" />
              <span>Expiry: <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">{driver.licenseExpiry}</span></span>
            </div>
          </div>
        </div>

        {/* Right Area columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Safety Score</span>
              <div className="text-2xl font-bold text-green-600 mt-2">{driver.safetyScore}</div>
              <span className="text-[10px] text-on-surface-variant mt-1 block">Excellent status</span>
            </div>

            <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Total Trips</span>
              <div className="text-2xl font-bold text-on-surface mt-2">{driver.totalTrips}</div>
              <span className="text-[10px] text-on-surface-variant mt-1 block">Lifetime completion</span>
            </div>

            <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">On-Time Rate</span>
              <div className="text-2xl font-bold text-primary mt-2">{driver.onTimeRate}%</div>
              <span className="text-[10px] text-on-surface-variant mt-1 block">Top 5% in fleet</span>
            </div>

            <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs text-center flex flex-col justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block">Rating</span>
              <div className="flex items-center gap-1 text-2xl font-bold text-on-surface mt-1">
                <Star className="w-5 h-5 fill-warning text-warning" /> {driver.rating}
              </div>
              <span className="text-[10px] text-on-surface-variant block">From dispatch reviews</span>
            </div>
          </div>

          {/* Recharts Performance chart */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[280px] flex flex-col justify-between">
            <h3 className="font-bold text-on-surface text-base mb-2">Monthly Dispatch Performance</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.tripsPerMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} />
                  <YAxis stroke="#737687" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completed" fill="#0061ff" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="cancelled" fill="#ba1a1a" radius={[4, 4, 0, 0]} name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Driving History Timeline */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-on-surface text-base mb-4">Driving Incident Timeline</h3>
            <div className="relative pl-6 border-l-2 border-outline-variant/40 space-y-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                <div className="text-xs text-on-surface-variant">Today</div>
                <div className="text-sm font-semibold">Completed Trip TR-8829 (Mumbai → Pune)</div>
                <p className="text-xs text-on-surface-variant mt-0.5">Delivered 8.5 tons of electronics on time.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                <div className="text-xs text-on-surface-variant">Yesterday</div>
                <div className="text-sm font-semibold">Assigned to Vehicle V-204</div>
                <p className="text-xs text-on-surface-variant mt-0.5">Fleet dispatcher assigned Tata Prima vehicle.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                <div className="text-xs text-on-surface-variant">July 9, 2026</div>
                <div className="text-sm font-semibold">Completed Safety Training Seminar</div>
                <p className="text-xs text-on-surface-variant mt-0.5">Certified for Eco-driving and hazardous terrain navigation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
