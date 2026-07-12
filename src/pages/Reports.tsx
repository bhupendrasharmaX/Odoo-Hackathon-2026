import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BarChart3, Download, Calendar, Filter, Share2 } from 'lucide-react';
import { chartData } from '../data/mockData';
import { formatCurrency } from '../lib/utils';

export default function Reports() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Reports & Analytics</h1>
          <p className="text-sm text-on-surface-variant">Perform deep analytics on fleet operations, fuel trends, and revenues.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('CSV exported')} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs">
            <Download className="w-4 h-4 text-on-surface-variant" /> Export CSV
          </button>
          <button onClick={() => alert('PDF report downloaded')} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors shadow-xs">
            <BarChart3 className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-outline" />
          <div className="flex bg-surface-container rounded-lg p-0.5 text-xs font-semibold uppercase tracking-wider">
            {['1M', '3M', '6M', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  timeRange === range ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-outline" />
          <select className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none">
            <option>All Divisions</option>
            <option>North Region</option>
            <option>South Region</option>
            <option>West Region</option>
          </select>
        </div>
      </div>

      {/* Grid of Report Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[320px] flex flex-col justify-between">
          <h3 className="font-bold text-on-surface text-base mb-2">Revenue vs Expense Growth</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.revenueVsExpense} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="repRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0061ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0061ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} />
                <YAxis stroke="#737687" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), '']} />
                <Area type="monotone" dataKey="revenue" stroke="#0061ff" strokeWidth={2.5} fillOpacity={1} fill="url(#repRev)" name="Revenue" />
                <Area type="monotone" dataKey="expense" stroke="#ba1a1a" strokeWidth={2} fillOpacity={0.05} name="Expense" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trips completion */}
        <div className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[320px] flex flex-col justify-between">
          <h3 className="font-bold text-on-surface text-base mb-2">Trip Dispatches Completed</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.tripsPerMonth} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} />
                <YAxis stroke="#737687" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#006c49" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="cancelled" fill="#ba1a1a" radius={[4, 4, 0, 0]} name="Cancelled" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel logs consumption */}
        <div className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[320px] flex flex-col justify-between">
          <h3 className="font-bold text-on-surface text-base mb-2">Monthly Fuel Consumption</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.fuelTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} />
                <YAxis stroke="#737687" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), '']} />
                <Area type="monotone" dataKey="diesel" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="Diesel Cost" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart comparing parameters */}
        <div className="bg-white border border-outline-variant/60 rounded-2xl p-5 shadow-xs h-[320px] flex flex-col justify-between">
          <h3 className="font-bold text-on-surface text-base mb-2">Fleet Operational Efficiency</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.revenueVsExpense} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} />
                <YAxis stroke="#737687" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#004bca" strokeWidth={2} name="Operating Index" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
