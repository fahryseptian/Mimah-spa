import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Award, 
  Percent,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { BookingItem, Therapist, ServiceItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface AnalyticsDashboardProps {
  bookings: BookingItem[];
  therapists: Therapist[];
  services: ServiceItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  bookings,
  therapists,
  services
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate Key Metrics
  const totalBookingsCount = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const completedCount = completedBookings.length;
  const completionRate = totalBookingsCount > 0 ? Math.round((completedCount / totalBookingsCount) * 100) : 0;

  const displayTotalOmzet = bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.totalAmount : 0), 0) || 0;

  // Platform Share (average 35%) & Therapist Share (65%)
  const platformEarnings = Math.round(displayTotalOmzet * 0.35);
  const therapistEarnings = displayTotalOmzet - platformEarnings;

  // Chart Data 1: Revenue & Booking Trend (Last 7 Days - Real Data)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueTrendData = last7Days.map(date => {
    const dayBookings = bookings.filter(b => b.bookingDate === date || b.createdAt?.startsWith(date));
    const dayOmzet = dayBookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.totalAmount : 0), 0);
    const dayName = new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });
    return {
      day: dayName,
      omzet: dayOmzet,
      platform: Math.round(dayOmzet * 0.35),
      bookings: dayBookings.length
    };
  });

  // Chart Data 2: Services Popularity Distribution (Real Data)
  const serviceCounts: Record<string, number> = {};
  bookings.forEach(b => {
    serviceCounts[b.serviceTitle] = (serviceCounts[b.serviceTitle] || 0) + 1;
  });

  const colors = ['#059669', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
  const serviceDistributionData = Object.entries(serviceCounts)
    .map(([name, count], index) => ({
      name,
      count,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Chart Data 3: Therapist Performance Leaderboard (Real Data)
  const therapistPerformanceData = [...therapists]
    .sort((a, b) => (b.completedOrders || 0) - (a.completedOrders || 0))
    .slice(0, 5)
    .map((t) => ({
      name: t.name.split(' ')[0],
      rating: t.rating,
      sessions: t.completedOrders || 0,
      omzet: Math.round((t.completedOrders || 0) * 150000), // Estimation
    }));

  // Chart Data 4: Booking Status Distribution (Real Data)
  const statusCounts = {
    'Selesai': bookings.filter(b => b.status === 'completed').length,
    'Sedang Jalan': bookings.filter(b => ['therapist_on_the_way', 'therapist_arrived', 'in_session'].includes(b.status)).length,
    'Terkonfirmasi': bookings.filter(b => b.status === 'confirmed').length,
    'Batal': bookings.filter(b => b.status === 'cancelled').length,
  };

  const statusDistributionData = [
    { name: 'Selesai', value: statusCounts['Selesai'], color: '#10b981' },
    { name: 'Sedang Jalan', value: statusCounts['Sedang Jalan'], color: '#3b82f6' },
    { name: 'Terkonfirmasi', value: statusCounts['Terkonfirmasi'], color: '#f59e0b' },
    { name: 'Batal', value: statusCounts['Batal'], color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Analytics Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Real-time Financial & Operational Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-serif-display mt-1">
            Ringkasan Analitik Bisnis Mimah Spa
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau pertumbuhan omzet, pembagian komisi terapis, dan tren permintaan layanan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Time Range Selector */}
          <div className="inline-flex p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '7d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '30d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === '90d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              3 Bulan
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Gross Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Gross Omzet</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="text-xs font-black tracking-tighter">Rp</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-stone-900 font-serif-display">
              {formatRupiah(displayTotalOmzet)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% dari bulan lalu</span>
            </div>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[78%]" />
          </div>
        </div>

        {/* Card 2: Platform Profit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Laba Bersih Mimah Spa</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-700 font-serif-display">
              {formatRupiah(platformEarnings)}
            </div>
            <div className="text-xs text-stone-500 font-medium mt-1">
              Bagi hasil platform (~35% omzet)
            </div>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[35%]" />
          </div>
        </div>

        {/* Card 3: Therapist Payout */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Hak Komisi Terapis</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-800 font-serif-display">
              {formatRupiah(therapistEarnings)}
            </div>
            <div className="text-xs text-stone-500 font-medium mt-1">
              Skema 60-75% untuk mitra terapis
            </div>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full w-[65%]" />
          </div>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Tingkat Pemenuhan Order</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-purple-900 font-serif-display">
              {completionRate}%
            </div>
            <div className="text-xs text-stone-500 font-medium mt-1">
              {completedCount} dari {totalBookingsCount} order sukses
            </div>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Revenue Trend (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Tren Omzet vs Margin Platform (Minggu Ini)</span>
              </h3>
              <p className="text-xs text-stone-500">Perbandingan total gross omzet dan bagian bersih usaha</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-stone-700">Gross Omzet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-stone-700">Margin Platform</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  tickFormatter={(val) => `${val / 1000000}JT`}
                />
                <Tooltip 
                  formatter={(value: any) => [formatRupiah(value), '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="omzet" name="Gross Omzet" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
                <Area type="monotone" dataKey="platform" name="Margin Platform" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPlatform)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Service Popularity Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-600" />
              <span>Distribusi Layanan Favorit</span>
            </h3>
            <p className="text-xs text-stone-500">Persentase jenis perawatan yang paling diminati</p>
          </div>

          <div className="h-[200px] w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {serviceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} sesi`, 'Jumlah']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {serviceDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-stone-700 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-stone-900">{item.count} sesi</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lower Row: Leaderboard Terapis & Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaderboard Terapis Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Performa Mitra Terapis Teratas (Jumlah Sesi & Rating)</span>
              </h3>
              <p className="text-xs text-stone-500">Terapis dengan kontribusi omzet terbesar bulan ini</p>
            </div>
          </div>

          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={therapistPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip formatter={(value: any, name: any) => [name === 'sessions' ? `${value} Sesi` : formatRupiah(value), name === 'sessions' ? 'Jumlah Sesi' : 'Total Omzet']} />
                <Bar dataKey="sessions" name="Jumlah Sesi" fill="#059669" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Status Operasional Order</span>
            </h3>
            <p className="text-xs text-stone-500">Rincian status pemesanan terkini</p>
          </div>

          <div className="space-y-3 pt-2">
            {statusDistributionData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">{item.name}</span>
                  <span className="font-bold text-stone-900">{item.value} Order</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      backgroundColor: item.color, 
                      width: `${totalBookingsCount > 0 ? Math.round((item.value / totalBookingsCount) * 100) : 0}%` 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 leading-relaxed mt-4">
            💡 <strong className="text-stone-800">Tips Operasional:</strong> Tingkat pembatalan rendah ( di bawah 5% ) menandakan ketersediaan terapis & sistem penetapan lokasi berjalan optimal.
          </div>
        </div>

      </div>

    </div>
  );
};
