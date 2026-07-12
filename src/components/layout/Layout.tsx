import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-(--spacing-container-max) mx-auto space-y-6 pb-12">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-outline-variant/30 bg-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-on-surface-variant gap-2 shrink-0">
          <div className="font-semibold text-on-surface">TransitOps</div>
          <p>© 2026 TransitOps Logistics Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-primary hover:underline">Terms of Service</a>
            <a href="#" className="hover:text-primary hover:underline">API Status</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
