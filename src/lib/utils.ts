import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = '₹'): string {
  if (amount >= 10000000) return `${currency}${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `${currency}${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`;
  return `${currency}${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Available': 'bg-blue-100 text-blue-800',
    'In Maintenance': 'bg-orange-100 text-orange-800',
    'Retired': 'bg-gray-100 text-gray-600',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    'Suspended': 'bg-red-100 text-red-800',
    'Inactive': 'bg-gray-100 text-gray-600',
    'Completed': 'bg-green-100 text-green-800',
    'In Transit': 'bg-blue-100 text-blue-800',
    'Scheduled': 'bg-purple-100 text-purple-800',
    'Dispatched': 'bg-cyan-100 text-cyan-800',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Overdue': 'bg-red-100 text-red-800',
    'Approved': 'bg-green-100 text-green-800',
    'Pending': 'bg-amber-100 text-amber-800',
    'Rejected': 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-blue-100 text-blue-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800',
  };
  return map[priority] || 'bg-gray-100 text-gray-600';
}
