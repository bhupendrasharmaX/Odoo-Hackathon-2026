import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, ChevronRight, User, Settings, LogOut, Menu, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Vehicle Maintenance Due', message: 'MH-12-AB-1234 scheduled service in 2 days', type: 'WARNING', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: '2', title: 'Trip Completed', message: 'Trip #TR-0045 completed successfully by Ravi Kumar', type: 'SUCCESS', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: '3', title: 'Driver License Expiring', message: 'Amit Patel license expires in 15 days', type: 'ALERT', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '4', title: 'Fuel Log Added', message: '45L diesel added to MH-04-CD-5678', type: 'INFO', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
  { id: '5', title: 'New Driver Onboarded', message: 'Suresh Mehta added to the fleet team', type: 'SUCCESS', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString() },
];

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const typeIcon = {
  INFO: <Info className="w-4 h-4 text-info" />, 
  WARNING: <AlertTriangle className="w-4 h-4 text-warning" />,
  ALERT: <AlertTriangle className="w-4 h-4 text-error" />,
  SUCCESS: <CheckCircle className="w-4 h-4 text-success" />,
};

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('transitops_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('transitops_dark_mode', String(darkMode));
  }, [darkMode]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    ...segments.slice(0, 3).map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ].filter((b, i, arr) => i === 0 || arr.findIndex(x => x.path === b.path) === i);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface-container-lowest/80 dark:bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/50 flex items-center justify-between px-4 md:px-6 transition-colors duration-300">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-on-surface-variant p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
          onClick={onMobileMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-outline" />}
              {i < breadcrumbs.length - 1 ? (
                <Link to={crumb.path} className="text-on-surface-variant hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-on-surface font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center w-80 relative">
        <Search className="absolute left-3 w-4 h-4 text-outline" />
        <input
          type="text"
          placeholder="Search vehicles, trips, drivers..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline text-on-surface"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-bold rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/50 z-50 overflow-hidden transition-all duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
                <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-container-low ${
                        !n.isRead ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{typeIcon[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${!n.isRead ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-outline mt-1">{getTimeAgo(n.createdAt)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-outline-variant/30 px-4 py-2.5">
                <button className="w-full text-center text-xs text-primary font-medium hover:text-primary/80 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-semibold text-sm">
              AS
            </div>
            <span className="hidden sm:block text-sm font-medium text-on-surface">Arjun S.</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/50 py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/30">
                <p className="text-sm font-semibold text-on-surface">Arjun Sharma</p>
                <p className="text-xs text-on-surface-variant">Fleet Manager</p>
              </div>
              <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <User className="w-4 h-4" /> Profile
              </button>
              <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-outline-variant/30 mt-1 pt-1">
                <button onClick={() => { navigate('/'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
