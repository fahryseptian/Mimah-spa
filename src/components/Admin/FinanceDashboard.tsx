import React from 'react';
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
  Wallet
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
  const { bookings, therapists } = useApp();

  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  // Calculate revenue
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  
  // Calculate Therapist share (assuming avg 70% for simplicity in calc, though it varies per therapist)
  const therapistShare = completedBookings.reduce((sum, b) => {
    const therapist = therapists.find(t => t.id === b.therapistId);
    const rate = therapist?.commissionRate || 0.75;
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
    { day: '07 Sep', revenue: totalRevenue / 10, profit: mimahGrossProfit / 10 },
  ];

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

      {/* Recent Payouts Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pengeluaran & Pencairan Komisi</h3>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Transaksi Terakhir</p>
          </div>
          <button className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:underline transition-all">Lihat Semua</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Penerima</th>
                <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Kategori</th>
                <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Jumlah</th>
                <th className="pb-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {[
                { name: 'Siti Aminah', cat: 'Komisi Layanan', amount: 350000, status: 'completed' },
                { name: 'Budi Santoso', cat: 'Komisi Layanan', amount: 480000, status: 'completed' },
                { name: 'Vendor Laundry', cat: 'Operasional', amount: 1200000, status: 'pending' },
                { name: 'Rina Sastrawati', cat: 'Komisi Layanan', amount: 250000, status: 'completed' },
              ].map((tx, idx) => (
                <tr key={idx} className="group hover:bg-stone-50 transition-colors">
                  <td className="py-4">
                    <div className="text-xs font-bold text-stone-900">{tx.name}</div>
                    <div className="text-[9px] text-stone-400 font-medium">10 Sep 2026, 14:20</div>
                  </td>
                  <td className="py-4 text-[10px] font-black text-stone-500 uppercase">{tx.cat}</td>
                  <td className="py-4 text-xs font-black text-stone-900 text-right">{formatRupiah(tx.amount)}</td>
                  <td className="py-4 text-right">
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
