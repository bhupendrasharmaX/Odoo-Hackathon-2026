import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, ChevronRight, User, Settings, LogOut, Menu } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    ...segments.slice(0, 3).map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ].filter((b, i, arr) => i === 0 || arr.findIndex(x => x.path === b.path) === i);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-outline-variant/50 flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-on-surface-variant"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
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
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-semibold text-sm">
              AS
            </div>
            <span className="hidden sm:block text-sm font-medium text-on-surface">Arjun S.</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-outline-variant/50 py-2 z-50">
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
                <button onClick={() => { navigate('/'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
