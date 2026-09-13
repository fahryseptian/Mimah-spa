import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Voucher } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';

export const VoucherManagement: React.FC = () => {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState: Voucher = {
    code: '',
    title: '',
    discountPercent: 0,
    discountAmount: 0,
    isFreeShipping: false,
    minOrder: 0,
    maxDiscount: 0,
    description: '',
    expiry: '',
    isActive: true,
    quota: 100,
    usageCount: 0,
  };
  
  const [formData, setFormData] = useState<Voucher>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateVoucher(formData.code, formData);
    } else {
      // Validate unique code
      if (vouchers.some(v => v.code === formData.code)) {
        alert('Kode voucher sudah digunakan!');
        return;
      }
      addVoucher(formData);
    }
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const handleEdit = (voucher: Voucher) => {
    setFormData(voucher);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (code: string) => {
    if (window.confirm(`Hapus voucher ${code}?`)) {
      deleteVoucher(code);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-serif-display">
              {isEditing ? 'Edit Voucher' : 'Buat Kupon Promo Baru'}
            </h3>
            <p className="text-xs text-stone-500">Atur diskon layanan, potongan persen, atau gratis ongkir transport</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Kode Voucher (Unik)</label>
              <input
                type="text"
                required
                disabled={isEditing}
                placeholder="MISAL: MEDANBEBASONGKIR"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Judul Promo</label>
              <input
                type="text"
                required
                placeholder="Diskon Akhir Pekan 20%"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tipe Diskon</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountPercent: 10, discountAmount: 0, isFreeShipping: false })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${formData.discountPercent ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-stone-200 text-stone-500'}`}
                >
                  Persen (%)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountPercent: 0, discountAmount: 50000, isFreeShipping: false })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${formData.discountAmount ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-stone-200 text-stone-500'}`}
                >
                  Nominal (Rp)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountPercent: 0, discountAmount: 0, isFreeShipping: true })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${formData.isFreeShipping ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-stone-200 text-stone-500'}`}
                >
                  Gratis Ongkir
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {!!formData.discountPercent && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Persentase (%)</label>
                  <input
                    type="number"
                    min="1" max="100"
                    required
                    value={formData.discountPercent || ''}
                    onChange={e => setFormData({ ...formData, discountPercent: Number(e.target.value) || 0 })}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  />
                </div>
              )}
              {!!formData.discountAmount && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Potongan Harga (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.discountAmount || ''}
                    onChange={e => setFormData({ ...formData, discountAmount: Number(e.target.value) || 0 })}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  />
                </div>
              )}
              {!!formData.discountPercent && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Maksimal Diskon (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount || ''}
                    onChange={e => setFormData({ ...formData, maxDiscount: Number(e.target.value) || 0 })}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Min. Pemesanan (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.minOrder || ''}
                onChange={e => setFormData({ ...formData, minOrder: Number(e.target.value) || 0 })}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tanggal Kedaluwarsa</label>
                <input
                  type="date"
                  required
                  value={formData.expiry}
                  onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Batas Kuota Pemakaian</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quota || ''}
                  onChange={e => setFormData({ ...formData, quota: Number(e.target.value) })}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi & Syarat Ketentuan</label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-stone-700">Aktifkan Voucher Ini</label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(initialFormState);
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {isEditing ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Simpan Perubahan' : 'Buat Voucher'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((v) => {
          const quota = v.quota || 0;
          const usageCount = v.usageCount || 0;
          const isExpired = new Date(v.expiry) < new Date();
          const isDepleted = quota > 0 && usageCount >= quota;
          const activeStatus = v.isActive && !isExpired && !isDepleted;

          return (
            <div key={v.code} className={`bg-white p-5 rounded-2xl border shadow-xs space-y-3 relative overflow-hidden ${activeStatus ? 'border-emerald-200' : 'border-stone-200 opacity-80'}`}>
              {!activeStatus && (
                <div className="absolute top-0 right-0 left-0 bg-stone-100 text-stone-500 text-[10px] font-bold text-center py-0.5 border-b border-stone-200">
                  {isExpired ? 'KEDALUWARSA' : isDepleted ? 'KUOTA HABIS' : 'NONAKTIF'}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <span className={`px-3 py-1 font-extrabold text-xs rounded-lg border ${activeStatus ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-stone-50 text-stone-600 border-stone-300'}`}>
                  {v.code}
                </span>
                <span className="text-[10px] font-bold text-stone-500">Exp: {v.expiry}</span>
              </div>
              
              <div>
                <h4 className="font-bold text-sm text-stone-900">{v.title}</h4>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{v.description}</p>
              </div>
              
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-[11px] font-medium space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nilai Diskon:</span>
                  <span className="font-bold text-emerald-700">
                    {v.isFreeShipping ? 'Gratis Ongkir' : v.discountPercent ? `${v.discountPercent}%` : formatRupiah(v.discountAmount || 0)}
                  </span>
                </div>
                {!!v.maxDiscount && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Maks. Potongan:</span>
                    <span className="font-bold text-stone-800">{formatRupiah(v.maxDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Min. Pemesanan:</span>
                  <span className="font-bold text-stone-800">{formatRupiah(v.minOrder)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 font-semibold text-stone-500">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Kuota: {usageCount} / {quota || '∞'}</span>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(v)} className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v.code)} className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};
