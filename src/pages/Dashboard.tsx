import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Truck, CheckCircle2, AlertTriangle, Route, Clock, 
  TrendingUp, CircleDollarSign, Fuel, Wrench, Plus, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../lib/utils';
import { dashboardStats as mockStats, chartData as mockChartData, trips, expenses, maintenanceRecords, fuelLogs } from '../data/mockData';
import { api } from '../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockStats);
  const [chartData, setChartData] = useState(mockChartData);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api.dashboard.getStats();
        if (data && data.stats) {
          setStats(data.stats);
        }
        if (data && data.charts) {
          setChartData(data.charts);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics from backend', err);
      }
    }
    loadDashboard();
  }, []);

  const kpis = [
    { label: 'Active Vehicles', value: stats.activeVehicles, subtitle: '+12% from last month', icon: Truck, color: 'text-primary bg-primary/10' },
    { label: 'Available Vehicles', value: stats.availableVehicles, subtitle: 'Ready for dispatch', icon: CheckCircle2, color: 'text-secondary bg-secondary/10' },
    { label: 'In Maintenance', value: stats.inMaintenance, subtitle: '3 urgent alerts', icon: AlertTriangle, color: 'text-error bg-error/10' },
    { label: 'Active Trips', value: stats.activeTrips, subtitle: '98% on-time dispatch', icon: Route, color: 'text-primary bg-primary/10' },
    { label: 'Pending Trips', value: stats.pendingTrips, subtitle: 'Next 24 hours schedule', icon: Clock, color: 'text-tertiary bg-tertiary/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Executive Dashboard</h1>
          <p className="text-sm text-on-surface-variant">Real-time overview of fleet operations and logistics performance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate('/vehicles/add')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-on-surface-variant" /> Add Vehicle
          </button>
          <button 
            onClick={() => navigate('/drivers/add')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-on-surface-variant" /> Add Driver
          </button>
          <button 
            onClick={() => navigate('/trips/create')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors shadow-xs"
          >
            <Route className="w-4 h-4" /> Create Trip
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-on-surface-variant tracking-wider uppercase">{kpi.label}</span>
              <div className={`p-2 rounded-xl ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-on-surface">{kpi.value}</span>
              <p className="text-[11px] text-on-surface-variant mt-1">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fleet Utilization Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Fleet Utilization</span>
            <span className="text-sm font-bold text-primary">{stats.fleetUtilization}%</span>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${stats.fleetUtilization}%` }}></div>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Optimal usage rate target is 85%</p>
          </div>
        </div>

        {/* Monthly Revenue Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Monthly Revenue</span>
              <div className="text-2xl font-bold text-on-surface mt-2">{formatCurrency(stats.monthlyRevenue)}</div>
            </div>
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary flex items-center gap-0.5 text-xs font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4%
            </div>
          </div>
          <p className="text-xs text-on-surface-variant mt-4">Estimated net margin is 24%</p>
        </div>

        {/* Cost Summary Box Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-3">Operating Expenses</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-error/10 text-error">
                <Fuel className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block uppercase font-medium">Fuel Cost</span>
                <span className="text-sm font-bold text-on-surface">{formatCurrency(stats.fuelCost)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10 text-warning">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block uppercase font-medium">Maintenance</span>
                <span className="text-sm font-bold text-on-surface">{formatCurrency(stats.maintenanceCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface text-base">Revenue vs Expenses</h3>
            <span className="text-xs text-on-surface-variant">Last 7 months</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.revenueVsExpense} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0061ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0061ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dae2fd/40" />
                <XAxis dataKey="month" stroke="#737687" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#737687" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), '']} labelStyle={{ fontSize: 12, fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="revenue" stroke="#0061ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                <Area type="monotone" dataKey="expense" stroke="#ba1a1a" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, marginTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status Donut */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col h-[360px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface text-base">Fleet Status</h3>
            <span className="text-xs text-on-surface-variant">Total: 348 Vehicles</span>
          </div>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.vehicleStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.vehicleStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Vehicles']} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[37%] flex flex-col items-center">
              <span className="text-3xl font-extrabold tracking-tight text-on-surface">348</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Total Vehicles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface text-base">Recent Trips</h3>
            <button onClick={() => navigate('/trips')} className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3">Trip ID</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Vehicle/Driver</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {trips.slice(0, 4).map((trip) => (
                  <tr key={trip.id} className="hover:bg-surface-container-lowest transition-colors cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                    <td className="py-3 font-semibold text-primary">{trip.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-on-surface">{trip.source.split(',')[0]} → {trip.destination.split(',')[0]}</div>
                      <span className="text-xs text-on-surface-variant">{trip.distance} km</span>
                    </td>
                    <td className="py-3">
                      <div className="text-on-surface">{trip.vehicleName}</div>
                      <span className="text-xs text-on-surface-variant">{trip.driverName}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-${trip.status === 'In Transit' ? 'blue-100 text-blue-800' : trip.status === 'Completed' ? 'green-100 text-green-800' : 'purple-100 text-purple-850'}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-on-surface text-base">Upcoming Maintenance</h3>
            <button onClick={() => navigate('/maintenance')} className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Service Type</th>
                  <th className="pb-3">Scheduled Date</th>
                  <th className="pb-3 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/20">
                {maintenanceRecords.slice(0, 4).map((record) => (
                  <tr key={record.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-3 font-semibold text-on-surface">{record.vehicleId}</td>
                    <td className="py-3">
                      <div className="font-medium text-on-surface">{record.type}</div>
                      <span className="text-xs text-on-surface-variant">{record.mechanic}</span>
                    </td>
                    <td className="py-3 text-on-surface-variant">{record.scheduledDate}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        record.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        record.priority === 'High' ? 'bg-orange-100 text-orange-850' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {record.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fuel Logs Section (Enhancement from Phase 4) */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-on-surface text-base">Recent Fuel Transactions</h3>
          <button onClick={() => navigate('/fuel')} className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
            View Fuel Logs <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                <th className="pb-3">Date</th>
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Quantity (L)</th>
                <th className="pb-3">Total Cost</th>
                <th className="pb-3">Station</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/20">
              {fuelLogs.slice(0, 3).map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-3 text-on-surface-variant">{log.date}</td>
                  <td className="py-3 font-semibold text-on-surface">{log.vehicleId} ({log.vehicleName})</td>
                  <td className="py-3">{log.quantity} L</td>
                  <td className="py-3 font-medium text-on-surface">{formatCurrency(log.totalCost)}</td>
                  <td className="py-3 text-on-surface-variant">{log.station}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
