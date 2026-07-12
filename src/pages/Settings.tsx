import React, { useState } from 'react';
import { 
  Settings, Bell, Shield, Users, Save, CheckCircle, 
  ToggleLeft, ToggleRight, Laptop, Monitor, AlertTriangle 
} from 'lucide-react';

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tripAlerts: true,
    maintReminders: true,
    weeklyDigest: false,
    budgetAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30m',
  });

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">System Settings</h1>
          <p className="text-sm text-on-surface-variant">Configure notifications, system security settings, and role permissions.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>System configurations updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notification Preferences
            </h3>
            
            <div className="space-y-4 divide-y divide-outline-variant/20">
              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Email Notifications</span>
                  <p className="text-xs text-on-surface-variant">Receive automated dispatch details and bills via email.</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, email: !notifications.email })} className="text-primary">
                  {notifications.email ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Push Notifications</span>
                  <p className="text-xs text-on-surface-variant">Receive real-time alerts in browser tab header.</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, push: !notifications.push })} className="text-primary">
                  {notifications.push ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Trip Alerts</span>
                  <p className="text-xs text-on-surface-variant">Instant alerts when a trip is delayed or cancelled.</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, tripAlerts: !notifications.tripAlerts })} className="text-primary">
                  {notifications.tripAlerts ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Maintenance Reminders</span>
                  <p className="text-xs text-on-surface-variant">Get notified 24 hours prior to scheduled diagnostics.</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, maintReminders: !notifications.maintReminders })} className="text-primary">
                  {notifications.maintReminders ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">Weekly Operational Digest</span>
                  <p className="text-xs text-on-surface-variant">Receive consolidated PDF analytics digest every Friday.</p>
                </div>
                <button onClick={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })} className="text-primary">
                  {notifications.weeklyDigest ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>
            </div>
          </div>

          {/* Role Management Card */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Role & Permissions Management
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold border-b border-outline-variant/30 pb-2">
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Assigned Members</th>
                    <th className="pb-2">Access Permissions</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr>
                    <td className="py-3 font-semibold">Administrator</td>
                    <td className="py-3">2 members</td>
                    <td className="py-3"><span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">Full Admin Access</span></td>
                    <td className="py-3 text-right"><button className="text-primary hover:underline">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Fleet Operations Manager</td>
                    <td className="py-3">5 members</td>
                    <td className="py-3"><span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Manage Vehicles / Drivers / Trips</span></td>
                    <td className="py-3 text-right"><button className="text-primary hover:underline">Edit</button></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Dispatcher</td>
                    <td className="py-3">8 members</td>
                    <td className="py-3"><span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Create & Assign Dispatches</span></td>
                    <td className="py-3 text-right"><button className="text-primary hover:underline">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Security Column */}
        <div className="space-y-6">
          {/* Security & Access Card */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Security & Session
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-on-surface block">2-Factor Authentication</span>
                  <span className="text-xs text-on-surface-variant">Secure your operations login portal.</span>
                </div>
                <button onClick={() => setSecurity({ ...security, twoFactor: !security.twoFactor })} className="text-primary">
                  {security.twoFactor ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-outline" />}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Session Auto-Timeout</label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-white focus:border-primary outline-none"
                >
                  <option value="15m">15 Minutes</option>
                  <option value="30m">30 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white border border-outline-variant/60 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-on-surface text-base border-b border-outline-variant/30 pb-3">Active Operations Sessions</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Laptop className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Chrome on Windows (Mumbai)</span>
                  <span className="text-xs text-on-surface-variant">Active now • IP: 103.55.10.45</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-outline shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Opera on Mac OS (Delhi)</span>
                  <span className="text-xs text-on-surface-variant">2 hours ago</span>
                </div>
              </div>
              <button onClick={() => alert('Sessions revoked')} className="w-full py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors">
                Revoke All Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
