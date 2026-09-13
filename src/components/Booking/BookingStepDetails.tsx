import React from 'react';
import { PaymentMethod } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { 
  Check, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  Ticket, 
  Info, 
  Sparkles,
  Receipt
} from 'lucide-react';

interface Props {
  customerName: string;
  setCustomerName: (n: string) => void;
  customerPhone: string;
  setCustomerPhone: (p: string) => void;
  specialNotes: string;
  setSpecialNotes: (n: string) => void;
  voucherCodeInput: string;
  setVoucherCodeInput: (v: string) => void;
  handleApplyVoucher: () => void;
  appliedVoucherCode: string;
  voucherDiscount: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (p: PaymentMethod) => void;
  hasAgreedToTerms: boolean;
  setHasAgreedToTerms: (a: boolean) => void;
  setIsTermsOpen: (o: boolean) => void;
  grandTotal: number;
  servicePrice: number;
  chosenAddOns: any[];
  addOnsTotal: number;
  transportCost: number;
  selectedServiceTitle: string;
  selectedDuration: number;
}

export const BookingStepDetails: React.FC<Props> = (props) => {
  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
      {/* SECTION 1: Customer Contact Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3 bg-emerald-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Data Pemesan</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-stone-500">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama Anda..."
              value={props.customerName}
              onChange={(e) => props.setCustomerName(e.target.value)}
              className="w-full bg-stone-50/50 hover:bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-stone-500">Nomor WhatsApp Aktif</label>
            <input
              type="tel"
              placeholder="Contoh: 08123456789"
              value={props.customerPhone}
              onChange={(e) => props.setCustomerPhone(e.target.value)}
              className="w-full bg-stone-50/50 hover:bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-stone-500">Instruksi Khusus / Keluhan Fisik (Opsional)</label>
          <textarea
            placeholder="Misal: Kurangi pijatan di bahu kiri, tumpuan pada punggung bawah..."
            value={props.specialNotes}
            onChange={(e) => props.setSpecialNotes(e.target.value)}
            rows={2}
            className="w-full bg-stone-50/50 hover:bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2 text-xs outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* SECTION 2: Voucher Code & Promos */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3 bg-emerald-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Kode Voucher / Promo</h3>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Masukkan kode voucher..."
              value={props.voucherCodeInput}
              onChange={(e) => props.setVoucherCodeInput(e.target.value.toUpperCase())}
              className="w-full bg-stone-50/50 border border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2.5 text-xs outline-none transition-all uppercase font-semibold"
            />
          </div>
          <button
            type="button"
            onClick={props.handleApplyVoucher}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Terapkan
          </button>
        </div>

        {props.appliedVoucherCode && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-semibold border border-emerald-100">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Voucher <strong>{props.appliedVoucherCode}</strong> aktif! Hemat <strong>{formatRupiah(props.voucherDiscount)}</strong>.</span>
          </div>
        )}
      </div>

      {/* SECTION 3: Payment Method Selection */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3 bg-emerald-600 rounded-full" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Metode Pembayaran (Xendit Gateway)</h3>
          </div>
          <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">⚡ Powered by Xendit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* QRIS Option */}
          <button
            type="button"
            onClick={() => props.setPaymentMethod('qris')}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all relative ${
              props.paymentMethod === 'qris'
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 font-medium'
                : 'border-stone-100 hover:border-stone-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <QrCode className="w-5 h-5 text-emerald-600" />
              {props.paymentMethod === 'qris' && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">QRIS / E-Wallet</div>
              <div className="text-[10px] text-stone-500">GoPay, OVO, ShopeePay, Dana</div>
            </div>
          </button>

          {/* Bank Transfer Option */}
          <button
            type="button"
            onClick={() => props.setPaymentMethod('transfer')}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all relative ${
              props.paymentMethod === 'transfer'
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 font-medium'
                : 'border-stone-100 hover:border-stone-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Building2 className="w-5 h-5 text-emerald-600" />
              {props.paymentMethod === 'transfer' && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Virtual Account</div>
              <div className="text-[10px] text-stone-500">BCA, Mandiri, BNI, BRI (VA)</div>
            </div>
          </button>

          {/* Cash / COD Option */}
          <button
            type="button"
            onClick={() => props.setPaymentMethod('cash')}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all relative ${
              props.paymentMethod === 'cash'
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 font-medium'
                : 'border-stone-100 hover:border-stone-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Banknote className="w-5 h-5 text-emerald-600" />
              {props.paymentMethod === 'cash' && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Tunai (COD)</div>
              <div className="text-[10px] text-stone-500">Bayar ke Terapis di Tempat</div>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 4: Professional Invoice Details */}
      <div className="p-4 bg-stone-50 text-stone-900 rounded-2xl space-y-3.5 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-1.5 border-b border-stone-200/60 pb-2">
          <Receipt className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wide">Rincian Pembayaran</span>
        </div>

        <div className="text-xs space-y-2">
          <div className="flex justify-between items-center text-stone-600">
            <span>{props.selectedServiceTitle} ({props.selectedDuration} Min)</span>
            <span className="font-bold">{formatRupiah(props.servicePrice)}</span>
          </div>

          {props.chosenAddOns.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Layanan Tambahan (Add-on):</div>
              {props.chosenAddOns.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-stone-600 pl-2">
                  <span>✨ {addon.name}</span>
                  <span>{formatRupiah(addon.price)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center text-stone-600">
            <span>Transportasi Home Service</span>
            <span className="font-bold">{formatRupiah(props.transportCost)}</span>
          </div>

          {props.voucherDiscount > 0 && (
            <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-100/40 px-2 py-1 rounded">
              <span>Diskon Voucher</span>
              <span>-{formatRupiah(props.voucherDiscount)}</span>
            </div>
          )}

          <div className="border-t border-dashed border-stone-300 pt-3.5 flex justify-between items-center text-sm">
            <span className="font-extrabold text-stone-900">Total Pembayaran</span>
            <span className="font-black text-emerald-800 text-base">{formatRupiah(props.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Terms & Conditions Checkbox */}
      <div className="flex items-start gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => props.setHasAgreedToTerms(!props.hasAgreedToTerms)}
          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
            props.hasAgreedToTerms 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : 'border-stone-300 bg-white hover:border-emerald-500'
          }`}
        >
          {props.hasAgreedToTerms && <Check className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[11px] text-stone-500 leading-relaxed">
          Saya menyetujui seluruh{' '}
          <button
            type="button"
            onClick={() => props.setIsTermsOpen(true)}
            className="text-emerald-700 font-bold underline hover:text-emerald-600 inline-block bg-transparent border-0 p-0 cursor-pointer"
          >
            Syarat & Ketentuan Layanan
          </button>{' '}
          serta menjamin bahwa lokasi pemesanan bebas dari segala aktivitas ilegal.
        </span>
      </div>
    </div>
  );
};
