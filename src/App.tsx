import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/VehicleList';
import VehicleAdd from './pages/VehicleAdd';
import VehicleDetails from './pages/VehicleDetails';
import DriverList from './pages/DriverList';
import DriverAdd from './pages/DriverAdd';
import DriverDetails from './pages/DriverDetails';
import TripList from './pages/TripList';
import TripCreate from './pages/TripCreate';
import TripDetails from './pages/TripDetails';
import MaintenanceList from './pages/MaintenanceList';
import FuelList from './pages/FuelList';
import ExpenseList from './pages/ExpenseList';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';

export default function App() {
  const basename = '/';
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Auth Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Shell Route */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Vehicles */}
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/add" element={<VehicleAdd />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />

          {/* Drivers */}
          <Route path="/drivers" element={<DriverList />} />
          <Route path="/drivers/add" element={<DriverAdd />} />
          <Route path="/drivers/:id" element={<DriverDetails />} />

          {/* Trips */}
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/create" element={<TripCreate />} />
          <Route path="/trips/:id" element={<TripDetails />} />

          {/* Maintenance */}
          <Route path="/maintenance" element={<MaintenanceList />} />
          <Route path="/maintenance/create" element={<MaintenanceList />} />

          {/* Fuel logs */}
          <Route path="/fuel" element={<FuelList />} />
          <Route path="/fuel/add" element={<FuelList />} />

          {/* Expenses */}
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/add" element={<ExpenseList />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Profile */}
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
