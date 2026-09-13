import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  Banknote,
  User,
  MessageSquare,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const DisputeCenter: React.FC = () => {
  const { refundDisputes, approveRefundDispute, rejectRefundDispute } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const filteredDisputes = refundDisputes.filter(d => {
    const matchesSearch = d.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         d.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || d.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const selectedDispute = refundDisputes.find(d => d.id === selectedDisputeId);

  const handleApprove = () => {
    if (selectedDisputeId) {
      approveRefundDispute(selectedDisputeId, adminNote);
      setAdminNote('');
    }
  };

  const handleReject = () => {
    if (selectedDisputeId) {
      rejectRefundDispute(selectedDisputeId, adminNote);
      setAdminNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-900 font-serif-display">Pusat Pengaduan & Refund</h3>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kelola Komplain & Permintaan Pengembalian Dana</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${activeFilter === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50'}`}
            >
              {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'approved' ? 'Disetujui' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispute List */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-stone-100 shadow-premium overflow-hidden">
          <div className="p-6 border-b border-stone-50 flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Cari kode booking..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold outline-none"
              />
            </div>
          </div>
          <div className="divide-y divide-stone-50 max-h-[600px] overflow-y-auto no-scrollbar">
            {filteredDisputes.length > 0 ? filteredDisputes.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDisputeId(d.id)}
                className={`w-full p-6 text-left hover:bg-stone-50 transition-all ${selectedDisputeId === d.id ? 'bg-stone-50 border-r-4 border-emerald-600' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{d.bookingCode}</div>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${d.status === 'pending' ? 'bg-amber-50 text-amber-600' : d.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {d.status}
                  </div>
                </div>
                <div className="text-sm font-bold text-stone-900 mb-1">{d.customerName}</div>
                <div className="text-[10px] text-stone-400 font-medium truncate">{d.reason}</div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-50/50">
                  <div className="text-[10px] font-black text-stone-900">{formatRupiah(d.refundAmount)}</div>
                  <div className="text-[9px] text-stone-400 font-medium">{d.createdAt}</div>
                </div>
              </button>
            )) : (
              <div className="p-12 text-center text-stone-400 text-xs italic">Tidak ada pengaduan ditemukan.</div>
            )}
          </div>
        </div>

        {/* Dispute Detail */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDispute.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedDispute.status === 'pending' ? 'bg-amber-100 text-amber-600' : selectedDispute.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {selectedDispute.status === 'pending' ? <Clock className="w-7 h-7" /> : selectedDispute.status === 'approved' ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-stone-900 tracking-tight">{selectedDispute.bookingCode}</h4>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{selectedDispute.serviceTitle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-stone-900">{formatRupiah(selectedDispute.refundAmount)}</div>
                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Refund Diajukan</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-3.5 h-3.5" /> Data Pelanggan
                        </div>
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                          <div className="text-sm font-bold text-stone-900">{selectedDispute.customerName}</div>
                          <div className="text-xs text-stone-500 font-medium">{selectedDispute.customerPhone}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <Banknote className="w-3.5 h-3.5" /> Info Rekening Refund
                        </div>
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                          <div className="text-xs font-bold text-stone-900">{selectedDispute.bankInfo}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5" /> Alasan Pengaduan
                        </div>
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 italic text-xs text-stone-600 leading-relaxed">
                          "{selectedDispute.reason}"
                        </div>
                      </div>

                      {selectedDispute.adminNote && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-3.5 h-3.5" /> Catatan Admin
                          </div>
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-700 font-medium">
                            {selectedDispute.adminNote}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedDispute.status === 'pending' && (
                    <div className="pt-8 border-t border-stone-50 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Catatan Keputusan Admin</label>
                        <textarea 
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="Tuliskan alasan persetujuan atau penolakan..."
                          className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-none"
                        />
                      </div>
                      <div className="flex gap-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleReject}
                          className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all"
                        >
                          Tolak Refund
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleApprove}
                          className="flex-[2] py-4 bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all"
                        >
                          Setujui & Proses Refund
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-stone-50/50 rounded-[3rem] border border-dashed border-stone-200 text-center space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-white shadow-premium flex items-center justify-center text-stone-200">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-400 font-serif-display">Pilih Pengaduan</h4>
                <p className="text-xs text-stone-400 max-w-[240px] mx-auto">Pilih salah satu log pengaduan untuk meninjau bukti & memberikan keputusan refund.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
