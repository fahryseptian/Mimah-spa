import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Users, 
  Briefcase, 
  History, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Copy,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const BroadcastCenter: React.FC = () => {
  const { therapists, customerProfiles, addWhatsappLog, whatsappLogs } = useApp();
  const [targetType, setTargetType] = useState<'customer' | 'therapist'>('customer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const targets = targetType === 'customer' ? customerProfiles : therapists;
  const filteredTargets = targets.filter((t: any) => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.phone.includes(searchTerm)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredTargets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTargets.map(t => t.id));
    }
  };

  const handleBroadcast = () => {
    if (selectedIds.length === 0 || !message.trim()) return;
    
    setIsSending(true);
    // Simulate broadcasting
    setTimeout(() => {
      selectedIds.forEach(id => {
        const target = targets.find(t => t.id === id);
        if (target) {
          addWhatsappLog(target.phone, message, `Broadcast ${targetType}`);
        }
      });
      setIsSending(false);
      setMessage('');
      setSelectedIds([]);
      alert(`Pesan berhasil dikirim ke ${selectedIds.length} penerima!`);
    }, 1500);
  };

  const templates = [
    { title: 'Promo Akhir Pekan', text: 'Halo Kak! Spesial akhir pekan ini, nikmati diskon 20% untuk Mimah Signature. Booking sekarang via aplikasi ya!' },
    { title: 'Pengingat SOP', text: 'Halo Rekan Mitra. Selalu pastikan menggunakan seragam bersih dan masker saat melayani pelanggan. Terima kasih.' },
    { title: 'Bonus Poin', text: 'Kabar Gembira! Kamu baru saja mendapatkan 5000 poin loyalitas dari Mimah Spa. Cek di aplikasi ya!' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-stone-900 font-serif-display">Broadcast Center (WhatsApp)</h3>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Kirim Pengumuman & Promo Secara Massal</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200">
          <button 
            onClick={() => { setTargetType('customer'); setSelectedIds([]); }}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${targetType === 'customer' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Users className="w-3.5 h-3.5" />
            Ke Pelanggan
          </button>
          <button 
            onClick={() => { setTargetType('therapist'); setSelectedIds([]); }}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${targetType === 'therapist' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Ke Mitra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recipient Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-premium overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="text" 
                  placeholder={`Cari ${targetType === 'customer' ? 'pelanggan' : 'mitra'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-xl text-xs font-bold outline-none"
                />
              </div>
              <button 
                onClick={selectAll}
                className="px-4 py-2 text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:bg-emerald-50 rounded-xl transition-colors"
              >
                {selectedIds.length === filteredTargets.length ? 'Batal Semua' : 'Pilih Semua'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-stone-50">
              {filteredTargets.map((t: any) => (
                <div 
                  key={t.id}
                  onClick={() => toggleSelect(t.id)}
                  className={`p-6 flex items-center gap-4 transition-all cursor-pointer ${selectedIds.includes(t.id) ? 'bg-emerald-50/50' : 'hover:bg-stone-50'}`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.includes(t.id) ? 'bg-emerald-600 border-emerald-600' : 'border-stone-200'}`}>
                    {selectedIds.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${targetType === 'customer' ? 'bg-stone-100 text-stone-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    {t.photoUrl ? <img src={t.photoUrl} alt="" className="w-full h-full object-cover rounded-xl" /> : t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-stone-900">{t.name}</div>
                    <div className="text-[10px] text-stone-400 font-medium">{t.phone}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <span className="text-emerald-700">{selectedIds.length}</span> Penerima Terpilih
              </div>
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Total {filteredTargets.length} Database
              </div>
            </div>
          </div>
        </div>

        {/* Message Editor */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Isi Pesan WhatsApp</label>
                <div className="text-[10px] font-black text-stone-300 uppercase">{message.length}/1000</div>
              </div>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan Anda di sini..."
                className="w-full px-6 py-6 bg-stone-50 border border-stone-100 rounded-3xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-[240px] resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Template Pesan Cepat
              </div>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl, i) => (
                  <button 
                    key={i}
                    onClick={() => setMessage(tpl.text)}
                    className="px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-[10px] font-bold text-stone-600 hover:bg-stone-100 transition-all flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={selectedIds.length === 0 || !message.trim() || isSending}
              onClick={handleBroadcast}
              className={`w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all ${selectedIds.length > 0 && message.trim() && !isSending ? 'bg-stone-900 text-white shadow-stone-900/20 hover:bg-stone-800' : 'bg-stone-100 text-stone-300 cursor-not-allowed'}`}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mengirim Pesan...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Kirim Ke {selectedIds.length} Penerima
                </>
              )}
            </button>
          </div>

          <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4">
            <Info className="w-5 h-5 text-emerald-600 mt-1" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-emerald-900">Tentang Broadcast</h5>
              <p className="text-xs text-emerald-700 leading-relaxed">Pesan akan dikirimkan secara antrian melalui log sistem. Pastikan konten pesan telah sesuai dengan kebijakan WhatsApp Business untuk menghindari pemblokiran nomor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
