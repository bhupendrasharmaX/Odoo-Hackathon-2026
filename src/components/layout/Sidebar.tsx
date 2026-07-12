import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Truck, Users, Route, Wrench, Fuel, Receipt, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Plus, Briefcase,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Vehicles', icon: Truck, path: '/vehicles' },
  { label: 'Drivers', icon: Users, path: '/drivers' },
  { label: 'Trips', icon: Route, path: '/trips' },
  { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
  { label: 'Fuel Logs', icon: Fuel, path: '/fuel' },
  { label: 'Expenses', icon: Receipt, path: '/expenses' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-outline-variant transition-all duration-300 z-50 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 min-h-[72px]">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold text-primary leading-none whitespace-nowrap">TransitOps</h1>
              <p className="text-[11px] text-on-surface-variant whitespace-nowrap">Enterprise Logistics</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        {!collapsed && (
          <button
            onClick={() => navigate('/trips/create')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
