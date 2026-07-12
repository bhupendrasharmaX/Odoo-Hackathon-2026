import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Truck, Users, Route, Wrench, Fuel, Receipt, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, Plus, Briefcase, X,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 min-h-[72px]">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5 h-5 text-on-primary" />
        </div>
        {(isMobile || !collapsed) && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-primary leading-none whitespace-nowrap">TransitOps</h1>
            <p className="text-[11px] text-on-surface-variant whitespace-nowrap">Enterprise Logistics</p>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {(isMobile || !collapsed) && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        {(isMobile || !collapsed) && (
          <button
            onClick={() => { navigate('/trips/create'); if (isMobile) onMobileClose?.(); }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        )}
        <button
          onClick={() => { navigate('/'); if (isMobile) onMobileClose?.(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors ${
            !isMobile && collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(isMobile || !collapsed) && <span>Logout</span>}
        </button>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container-low transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-surface-container-lowest border-r border-outline-variant transition-all duration-300 z-50 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={onMobileClose}
            />
            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col md:hidden shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
