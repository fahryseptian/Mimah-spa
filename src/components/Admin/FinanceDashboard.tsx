import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { formatRupiah } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export const FinanceDashboard: React.FC = () => {
  const { bookings, therapists, cashoutRequests, updateCashoutRequestStatus } = useApp();
  const [cashoutFilter, setCashoutFilter] = useState<'all' | 'pending' | 'processed' | 'completed'>('all');

  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  // Calculate revenue
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  
  // Calculate Therapist share
  const therapistShare = completedBookings.reduce((sum, b) => {
    const therapist = therapists.find(t => t.id === b.therapistId);
    const rate = therapist?.commissionRate || 0.70;
    return sum + (b.servicePrice * rate) + b.transportCost;
  }, 0);

  const mimahGrossProfit = totalRevenue - therapistShare;

  // Chart Data
  const dailyData = [
    { day: '01 Sep', revenue: 4200000, profit: 1200000 },
    { day: '02 Sep', revenue: 3800000, profit: 1050000 },
    { day: '03 Sep', revenue: 5100000, profit: 1450000 },
    { day: '04 Sep', revenue: 4800000, profit: 1300000 },
    { day: '05 Sep', revenue: 6200000, profit: 1800000 },
    { day: '06 Sep', revenue: 7500000, profit: 2100000 },
    { day: '07 Sep', revenue: totalRevenue / 10 || 4500000, profit: mimahGrossProfit / 10 || 1350000 },
  ];

  const filteredCashouts = cashoutRequests.filter(r => {
    if (cashoutFilter === 'all') return true;
    return r.status === cashoutFilter;
  });

  const pendingCount = cashoutRequests.filter(r => r.status === 'pending').length;

  const categoryData = [
    { name: 'Traditional', value: 45, color: '#059669' },
    { name: 'Signature', value: 30, color: '#0891b2' },
    { name: 'Reflexology', value: 15, color: '#7c3aed' },
    { name: 'Other', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: totalRevenue, icon: DollarSign, color: 'emerald', trend: '+12.5%' },
          { label: 'Mitra Earnings', value: therapistShare, icon: Wallet, color: 'blue', trend: '+8.2%' },
          { label: 'Gross Profit', value: mimahGrossProfit, icon: TrendingUp, color: 'amber', trend: '+15.1%' },
          { label: 'Avg Ticket', value: totalRevenue / (completedBookings.length || 1), icon: BarChartIcon, color: 'purple', trend: '+2.4%' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-premium group hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-stone-900 tracking-tighter">{formatRupiah(stat.value)}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900 font-serif-display">Tren Pendapatan</h3>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Performan 7 Hari Terakhir</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                <Filter className="w-4 h-4 text-stone-600" />
              </button>
              <button className="p-2.5 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
                <Download className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#a8a29e' }}
                  tickFormatter={(val) => `Rp${val/1000000}jt`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [formatRupiah(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 font-serif-display">Kategori Layanan</h3>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Distribusi Volume Pesanan</p>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[11px] font-bold text-stone-600">{cat.name}</span>
                </div>
                <span className="text-[11px] font-black text-stone-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cashout / Withdrawal Requests Management Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-900 font-serif-display">Permintaan Penarikan Komisi (Cashout)</h3>
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-900 text-[10px] font-black animate-pulse">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Pencairan Dompet Mitra Terapis & Status Transfer</p>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
            {(['all', 'pending', 'processed', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCashoutFilter(tab)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  cashoutFilter === tab
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab === 'pending' ? 'Pending' : tab === 'processed' ? 'Diproses' : 'Selesai'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredCashouts.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
              <Wallet className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-500">Belum ada permintaan penarikan komisi dalam kategori ini.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-stone-700">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-black text-[9px] uppercase tracking-widest">
                  <th className="py-4 px-4">Terapis</th>
                  <th className="py-4 px-4">Bank / Rekening</th>
                  <th className="py-4 px-4">Jumlah Penarikan</th>
                  <th className="py-4 px-4">Waktu</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCashouts.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-stone-900">
                      <div>{req.therapistName}</div>
                      <div className="text-[9px] font-medium text-stone-400">ID: {req.therapistId}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <div className="font-bold text-stone-800">{req.paymentMethod}</div>
                      <div className="text-stone-500 font-mono text-[11px]">{req.accountNo} ({req.accountName})</div>
                    </td>
                    <td className="py-4 px-4 font-black text-emerald-700 text-sm">
                      {formatRupiah(req.amount)}
                    </td>
                    <td className="py-4 px-4 text-[10px] text-stone-500 font-semibold">
                      {req.createdAt}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        req.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'processed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : req.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {req.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'processed' && <Clock className="w-3 h-3 animate-spin" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {req.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => updateCashoutRequestStatus(req.id, 'processed')}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                            title="Tandai Sedang Diproses"
                          >
                            Proses
                          </button>
                        )}
                        {(req.status === 'pending' || req.status === 'processed') && (
                          <button
                            onClick={() => updateCashoutRequestStatus(req.id, 'completed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-sm"
                            title="Tandai Selesai / Ditransfer"
                          >
                            Selesai (Transfer)
                          </button>
                        )}
                        {req.status !== 'rejected' && req.status !== 'completed' && (
                          <button
                            onClick={() => updateCashoutRequestStatus(req.id, 'rejected')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                            title="Tolak & Kembalikan Saldo"
                          >
                            Tolak
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
