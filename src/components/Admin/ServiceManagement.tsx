import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  Tag,
  Image as ImageIcon,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const ServiceManagement: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('pijat_tradisional');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(60);
  const [image, setImage] = useState('');

  const resetForm = () => {
    setTitle('');
    setTagline('');
    setCategory('pijat_tradisional');
    setDescription('');
    setPrice(0);
    setDuration(60);
    setImage('');
    setEditingService(null);
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setTitle(service.title);
    setTagline(service.tagline);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.durationOptions[0]?.price || 0);
    setDuration(service.durationOptions[0]?.durationMinutes || 60);
    setImage(service.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: any = {
      title,
      tagline,
      category,
      description,
      image: image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&auto=format&fit=crop&q=80',
      durationOptions: [
        { durationMinutes: duration, price: price }
      ],
      benefits: ['Relaksasi', 'Kebugaran', 'Higienis'],
      suitableFor: ['Wanita', 'Ibu Rumah Tangga'],
      includes: ['Terapis Berpengalaman', 'Minyak Alami'],
      iconName: 'Sparkles',
      availableAddOns: [],
      allowedGenders: ['female']
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService({
        id: `service-${Date.now()}`,
        ...serviceData
      } as ServiceItem);
    }

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-stone-900 font-serif-display">Katalog Layanan Digital</h3>
          <p className="text-sm text-stone-500 font-medium">Atur portofolio layanan spa & massage Mimah Spa secara real-time.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {services.map((service, idx) => (
            <motion.div 
              layout
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[2rem] border border-stone-100 shadow-soft overflow-hidden group hover:shadow-premium transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                    {service.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <h4 className="text-lg font-bold font-serif-display leading-tight">{service.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/70">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.durationOptions[0]?.durationMinutes} Min</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Home Service</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <p className="text-xs text-stone-500 leading-relaxed italic line-clamp-2">"{service.tagline}"</p>
                
                <div className="flex items-center justify-between py-4 border-y border-stone-50">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Harga Retail</div>
                    <div className="text-lg font-black text-emerald-700 tracking-tighter">
                      {formatRupiah(service.durationOptions[0]?.price || 0)}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Tag className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-stone-200"
                  >
                    Edit Detail
                  </button>
                  <button
                    onClick={() => { if(window.confirm('Hapus layanan ini dari sistem?')) deleteService(service.id); }}
                    className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] max-w-2xl w-full border border-stone-200 p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-8 right-8 p-3 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8 space-y-1">
                <h3 className="text-3xl font-bold font-serif-display text-stone-900">{editingService ? 'Edit Konfigurasi Layanan' : 'Publikasi Layanan Baru'}</h3>
                <p className="text-sm text-stone-500 font-medium">Sesuaikan parameter layanan untuk tampil di aplikasi pelanggan.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Nama Layanan</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl px-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Kategori Utama</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-stone-50 border-none rounded-2xl px-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option value="pijat_tradisional">Pijat Tradisional</option>
                      <option value="refleksi">Refleksi Kaki/Tangan</option>
                      <option value="mimah_signature">Mimah Signature</option>
                      <option value="totok_lulur">Totok & Lulur</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Tagline Menarik</label>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl px-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Contoh: Solusi pegal leher & pundak..." required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Deskripsi Pelayanan</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl px-5 py-3.5 text-xs font-bold text-stone-900 outline-none min-h-[100px] focus:ring-2 focus:ring-emerald-500/20" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Harga Satuan (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">Rp</span>
                      <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} className="w-full bg-stone-50 border-none rounded-2xl pl-11 pr-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Durasi Default (Menit)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} className="w-full bg-stone-50 border-none rounded-2xl pl-11 pr-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em] px-1">Tautan Foto Layanan (Unsplash)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-stone-50 border-none rounded-2xl pl-11 pr-5 py-3.5 text-xs font-bold text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="https://images.unsplash.com/..." />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-900/30 transition-all mt-4 active:scale-[0.98]"
                >
                  {editingService ? 'Simpan Perubahan Layanan' : 'Publikasikan ke Aplikasi'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
