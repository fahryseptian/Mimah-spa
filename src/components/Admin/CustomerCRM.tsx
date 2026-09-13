import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  History, 
  Gift, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const CustomerCRM: React.FC = () => {
  const { customerProfiles, awardPointsToCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftPoints, setGiftPoints] = useState(1000);

  const filteredCustomers = customerProfiles.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const customer = customerProfiles.find(c => c.id === selectedCustomer);

  const handleGiftPoints = () => {
    if (customer) {
      awardPointsToCustomer(customer.phone, giftPoints);
      setShowGiftModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pusat Data Pelanggan (CRM)</h3>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kelola Hubungan & Loyalitas Pelanggan</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau nomor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-stone-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none w-[240px] shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-stone-600">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-stone-100 shadow-premium overflow-hidden">
          <div className="p-6 border-b border-stone-50 flex items-center justify-between">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Daftar Pelanggan</h4>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{filteredCustomers.length} Total</span>
          </div>
          <div className="divide-y divide-stone-50 max-h-[600px] overflow-y-auto no-scrollbar">
            {filteredCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomer(c.id)}
                className={`w-full p-6 flex items-center gap-4 hover:bg-stone-50 transition-all text-left ${selectedCustomer === c.id ? 'bg-stone-50 border-r-4 border-emerald-600' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${c.isVip ? 'bg-amber-50 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-stone-900 truncate">{c.name}</div>
                    {c.isVip && <Crown className="w-3 h-3 text-amber-500" />}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">{c.phone}</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-stone-300 transition-all ${selectedCustomer === c.id ? 'translate-x-1 text-emerald-600' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Customer Detail */}
        <div className="lg:col-span-2">
          {customer ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl ${customer.isVip ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-stone-900 tracking-tight">{customer.name}</h3>
                          {customer.isVip && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">VVIP Member</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <Phone className="w-3.5 h-3.5" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                              <Mail className="w-3.5 h-3.5" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowGiftModal(true)}
                        className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100"
                      >
                        <Gift className="w-4 h-4" />
                        Kasih Poin Hadiah
                      </motion.button>
                      <button className="p-3 bg-stone-50 rounded-xl text-stone-400 hover:text-stone-600 transition-colors border border-stone-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-stone-50">
                    <div className="p-6 bg-stone-50/50 rounded-[2rem] border border-stone-100 space-y-1">
                      <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Transaksi</div>
                      <div className="text-xl font-black text-stone-900">{customer.totalTransactions} Pesanan</div>
                    </div>
                    <div className="p-6 bg-stone-50/50 rounded-[2rem] border border-stone-100 space-y-1">
                      <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Pengeluaran</div>
                      <div className="text-xl font-black text-stone-900">{formatRupiah(customer.totalSpent)}</div>
                    </div>
                    <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-stone-100 space-y-1">
                      <div className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Loyalty Points</div>
                      <div className="text-xl font-black text-emerald-900">{customer.loyaltyPoints.toLocaleString()} Poin</div>
                    </div>
                  </div>
                </div>

                {/* Activity Logs */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-stone-900 font-serif-display">Riwayat Aktivitas</h4>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Jejak Transaksi Terakhir</p>
                    </div>
                    <button className="text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-emerald-700 transition-colors">Lihat Semua</button>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 flex items-center justify-between group hover:border-emerald-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                            <History className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">Pemesanan Mimah Signature (90m)</div>
                            <div className="text-[9px] text-stone-400 font-medium">10 Sep 2026 • MS-992120</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-stone-900">{formatRupiah(285000)}</div>
                          <div className="text-[8px] font-black text-emerald-600 uppercase">Completed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-stone-50/50 rounded-[3rem] border border-dashed border-stone-200 text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white shadow-premium flex items-center justify-center text-stone-200">
                <Users className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-400 font-serif-display">Pilih Pelanggan</h4>
                <p className="text-xs text-stone-400 max-w-[240px] mx-auto">Pilih salah satu pelanggan di daftar kiri untuk melihat detail profil & loyalitas.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gift Modal */}
      <AnimatePresence>
        {showGiftModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGiftModal(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 space-y-8"
            >
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">Kirim Hadiah Poin</h3>
                <p className="text-xs text-stone-400">Poin akan langsung ditambahkan ke akun <strong>{customer?.name}</strong>.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[1000, 5000, 10000].map(val => (
                    <button
                      key={val}
                      onClick={() => setGiftPoints(val)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${giftPoints === val ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100'}`}
                    >
                      {val.toLocaleString()} Pts
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Jumlah Kustom</label>
                  <input 
                    type="number" 
                    value={giftPoints}
                    onChange={(e) => setGiftPoints(parseInt(e.target.value))}
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-lg font-black focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 py-4 text-[11px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleGiftPoints}
                  className="flex-[2] py-4 bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all"
                >
                  Kirim Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
