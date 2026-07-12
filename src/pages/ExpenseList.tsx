import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Plus, Search, CheckCircle, Receipt, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { expenses as initialExpenses, vehicles, chartData } from '../data/mockData';
import { formatCurrency, getStatusColor } from '../lib/utils';
import type { Expense, ExpenseCategory } from '../types';
import { api } from '../lib/api';

const expenseSchema = zod.object({
  category: zod.enum(['Fuel', 'Maintenance', 'Insurance', 'Toll', 'Driver Allowance', 'Parking', 'Fines', 'Other']),
  amount: zod.number().min(1, 'Amount must be greater than 0'),
  date: zod.string().min(1, 'Date is required'),
  description: zod.string().min(3, 'Description is required'),
  vehicleId: zod.string().optional(),
});

type ExpenseFields = zod.infer<typeof expenseSchema>;

const PIE_COLORS = ['#004bca', '#006c49', '#ba1a1a', '#48586d', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

export default function ExpenseList() {
  const [expenseList, setExpenseList] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await api.expenses.getAll();
        setExpenseList(data);
      } catch (err) {
        console.error('Failed to fetch expenses', err);
      }
    }
    loadExpenses();
  }, []);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExpenseFields>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'Fuel',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = (data: ExpenseFields) => {
    const v = vehicles.find(item => item.id === data.vehicleId);
    const newExp: Expense = {
      id: `EXP-${2000 + expenseList.length + 1}`,
      date: data.date,
      category: data.category,
      description: data.description,
      vehicleId: data.vehicleId,
      vehicleName: v ? v.name : undefined,
      amount: data.amount,
      status: 'Pending',
    };
    setExpenseList([newExp, ...expenseList]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
      reset();
    }, 1200);
  };

  const filteredExpenses = expenseList.filter(exp => {
    const matchesSearch = 
      exp.description.toLowerCase().includes(search.toLowerCase()) ||
      (exp.vehicleId && exp.vehicleId.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Recharts Pie Chart Data formatting
  const categoryTotals = expenseList.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Expenses</h1>
          <p className="text-sm text-on-surface-variant">Review operating costs, tolls, maintenance expenses, and verify budgets.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/95 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Total Expenses MTD</span>
          <div className="text-2xl font-black text-on-surface mt-2">{formatCurrency(845000)}</div>
          <span className="text-[10px] text-red-650 font-semibold block mt-1">+12.3% vs last period</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Average / Vehicle</span>
          <div className="text-2xl font-black text-on-surface mt-2">{formatCurrency(24142)}</div>
          <span className="text-[10px] text-on-surface-variant block mt-1">Based on active fleet</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-600 mt-2">12 Entries</div>
          <span className="text-[10px] text-on-surface-variant block mt-1">Needs review soon</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider block font-semibold">Budget Utilization</span>
          <div className="text-2xl font-black text-green-600 mt-2">68% Used</div>
          <div className="h-1 bg-surface-container-high rounded-full overflow-hidden mt-2">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      {/* Dual Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart Category Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col h-[340px] lg:col-span-1">
          <h3 className="font-bold text-on-surface text-base mb-2">Category Breakdown</h3>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '12px' }} labelStyle={{ color: 'var(--color-on-surface)' }} itemStyle={{ color: 'var(--color-on-surface)' }} formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Trend Chart */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-xs flex flex-col h-[340px] lg:col-span-2">
          <h3 className="font-bold text-on-surface text-base mb-2">Monthly Expense Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.revenueVsExpense} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" strokeOpacity={0.2} />
                <XAxis dataKey="month" stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-outline)" fontSize={11} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-high)', borderColor: 'var(--color-outline-variant)', borderRadius: '12px' }} labelStyle={{ color: 'var(--color-on-surface)' }} itemStyle={{ color: 'var(--color-on-surface)' }} formatter={(value: any) => [formatCurrency(Number(value)), '']} />
                <Line type="monotone" dataKey="expense" stroke="#ba1a1a" strokeWidth={2.5} activeDot={{ r: 6 }} name="Monthly Cost" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search expense description, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Fuel">Fuel</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Insurance">Insurance</option>
            <option value="Toll">Toll</option>
            <option value="Driver Allowance">Driver Allowance</option>
            <option value="Parking">Parking</option>
            <option value="Fines">Fines</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Expenses Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold text-on-surface-variant uppercase tracking-wider bg-surface-container-low/40">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant/20">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-primary">{exp.id}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{exp.date}</td>
                    <td className="py-4 px-6 font-bold">{exp.category}</td>
                    <td className="py-4 px-6">{exp.description}</td>
                    <td className="py-4 px-6 font-semibold text-on-surface">
                      {exp.vehicleId ? (
                        <>
                          <div>{exp.vehicleId}</div>
                          <span className="text-xs text-on-surface-variant">{exp.vehicleName}</span>
                        </>
                      ) : (
                        <span className="text-xs text-on-surface-variant">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-on-surface">{formatCurrency(exp.amount)}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">No expense records found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-scale-in">
            {success && (
              <div className="absolute inset-0 bg-surface-container-lowest/95 flex flex-col items-center justify-center z-20">
                <CheckCircle className="w-12 h-12 text-green-600 animate-bounce mb-3" />
                <span className="font-bold text-on-surface">Expense log created successfully!</span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-4">
              <h3 className="font-bold text-on-surface text-lg">Record Operational Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Category *</label>
                  <select 
                    {...register('category')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Toll">Toll</option>
                    <option value="Driver Allowance">Driver Allowance</option>
                    <option value="Parking">Parking</option>
                    <option value="Fines">Fines</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Amount (INR) *</label>
                  <input 
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                  {errors.amount && <p className="text-xs text-error mt-0.5">{errors.amount.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Date *</label>
                  <input 
                    {...register('date')}
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Select Vehicle (Optional)</label>
                  <select 
                    {...register('vehicleId')}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                  >
                    <option value="">No Vehicle association</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.id} - {v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Description *</label>
                <input 
                  {...register('description')}
                  type="text"
                  placeholder="e.g. Expressway Toll fees"
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm bg-surface-container-lowest focus:border-primary outline-none"
                />
                {errors.description && <p className="text-xs text-error mt-0.5">{errors.description.message}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-medium hover:bg-primary/95 transition-colors">
                  Submit Expense
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface py-2.5 rounded-xl font-medium hover:bg-surface-container-low transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
