import React, { useState } from 'react';
import { X, ShieldCheck, Info, Scale, AlertTriangle, CheckCircle2, RefreshCw, Lock, Clock, CreditCard, PhoneCall, Sparkles, UserPlus, Mail } from 'lucide-react';
import { TherapistRegistrationModal } from './Therapists/TherapistRegistrationModal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'refund' | 'privacy' | 'careers';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, defaultTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'refund' | 'privacy' | 'careers'>(defaultTab);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden text-stone-800 flex flex-col max-h-[90vh] border border-stone-100">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-100 bg-stone-50/80 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/10">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-stone-900 tracking-tight">Legalitas & Kebijakan Layanan</h3>
                <p className="text-xs text-stone-500 font-medium">Mimah Spa Home Service Medan • Berlaku Efektif 2026</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-stone-200/50 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'terms'
                  ? 'bg-white text-stone-900 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Syarat & Ketentuan</span>
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'refund'
                  ? 'bg-white text-stone-900 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Kebijakan Refund</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'privacy'
                  ? 'bg-white text-stone-900 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Privasi (PDP)</span>
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'careers'
                  ? 'bg-white text-stone-900 shadow-sm font-black'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Karir & Kemitraan</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
          {/* TAB 1: SYARAT & KETENTUAN */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  1. Perlindungan Terapis & Kebijakan Zero Tolerance
                </h4>
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-950 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    PERINGATAN HUKUM KETAT (ZERO TOLERANCE POLICY)
                  </p>
                  <p>
                    Mimah Spa adalah penyedia layanan <strong>terapi kebugaran, kesehatan keluarga, dan spa profesional</strong> resmi. Kami melarang keras segala bentuk tindakan atau permintaan tidak bermoral, asusila, maupun pelecehan verbal/fisik terhadap terapis kami.
                  </p>
                  <p className="font-semibold text-rose-900">
                    Sanksi: Pelanggaran akan langsung diproses secara hukum pidana (KUHP & UU ITE) serta pemblokiran permanen tanpa pengembalian dana.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  2. Ketentuan Gender & Standar Terapis
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm">
                  Demi kenyamanan dan kesopanan sesuai dengan norma agama & budaya, layanan Mimah Spa diperuntukkan <strong>khusus untuk Pelanggan Wanita, Ibu Hamil, Pasca Persalinan, dan Anak-anak</strong>. Seluruh terapis kami adalah wanita terlatih dan bersertifikat BNSP.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  3. Persyaratan Kesehatan & Kontraindikasi
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm">
                  Pelanggan wajib memberitahukan riwayat kesehatan khusus sebelum terapi dimulai, meliputi:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                  <li>Kehamilan trimester pertama (0-12 minggu)</li>
                  <li>Riwayat operasi medis terbaru / patah tulang</li>
                  <li>Penyakit kulit menular, infeksi, atau demam tinggi</li>
                  <li>Alergi terhadap minyak aromaterapi tertentu</li>
                </ul>
                <p className="text-xs text-stone-500 italic">
                  *Mimah Spa tidak bertanggung jawab atas komplikasi medis akibat ketidakjujuran informasi kesehatan pelanggan.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  4. Tarif Transportasi & Area Layanan Medan
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm">
                  Biaya transportasi terapis dihitung berdasarkan estimasi jarak GPS dari Pos Terdekat (Medan Baru, Medan Johor, Medan Barat, Medan Petisah, dll). Mimah Spa berhak menyesuaikan biaya jika terdapat selisih jarak fisik lebih dari 2 KM dari pin lokasi.
                </p>
              </section>

            </div>
          )}

          {/* TAB 2: KEBIJAKAN REFUND & CANCELLATION */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Garansi Jaminan Transaksi Transparan</p>
                  <p>Mimah Spa menjamin pengembalian dana (refund) yang adil dan efisien apabila terjadi pembatalan sesuai syarat & ketentuan yang berlaku.</p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  Skema & Potongan Pembatalan (Refund Rate)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-700 uppercase tracking-wider">H-1 s/d &gt; 1 Jam Sebelum</span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg">REFUND 100%</span>
                    </div>
                    <p className="text-xs text-stone-500">Pembatalan yang dikonfirmasi minimal 1 jam sebelum jam layanan tiba. Dana kembali utuh tanpa potongan.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-700 uppercase tracking-wider">&lt; 1 Jam (Terapis Belum OTW)</span>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-black rounded-lg">REFUND 80%</span>
                    </div>
                    <p className="text-xs text-stone-500">Dikenakan potongan administrasi 20% untuk kompensasi persiapan perlengkapan terapis.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-700 uppercase tracking-wider">Terapis Dalam Perjalanan (OTW)</span>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg">REFUND 50%</span>
                    </div>
                    <p className="text-xs text-stone-500">Layanan dibatalkan saat terapis di jalan. Biaya transport terapis tetap wajib dibayar penuh.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-700 uppercase tracking-wider">Terapis Tiba di Lokasi</span>
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[10px] font-black rounded-lg">REFUND 0%</span>
                    </div>
                    <p className="text-xs text-stone-500">Jika pelanggan membatalkan saat terapis sudah ada di tempat atau rumah kosong/tidak dapat dihubungi.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Estimasi Waktu Pencairan Dana (Refund Speed)
                </h4>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                    <span className="font-bold text-stone-800">Transfer Bank (BCA/Mandiri/BRI)</span>
                    <span className="font-bold text-emerald-700">Maksimal 1 x 24 Jam</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                    <span className="font-bold text-stone-800">E-Wallet (GoPay/OVO/ShopeePay/QRIS)</span>
                    <span className="font-bold text-emerald-700">Instant s/d 3 Jam Kerja</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Garansi Keterlambatan Terapis (&gt;30 mnt)</span>
                    <span className="font-bold text-emerald-700">Kupon Diskon 20% / Extra 15 Mnt</span>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <PhoneCall className="w-5 h-5 text-emerald-600" />
                  Cara Mengajukan Klaim Refund
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-600">
                  <li>Buka tab <strong>Pesanan Saya</strong> atau hubungi Admin WhatsApp Official di <strong>0812-3456-7890</strong>.</li>
                  <li>Sebutkan Kode Booking (contoh: <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-bold">MIMAH-8921</code>).</li>
                  <li>Berikan nomor rekening bank / akun e-wallet atas nama pemesan untuk pencairan dana.</li>
                </ol>
              </section>

            </div>
          )}

          {/* TAB 3: PRIVASI DATA (PDP) */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-4 bg-stone-900 text-white rounded-2xl flex items-center gap-3">
                <Lock className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-400">Kepatuhan UU No. 27 Tahun 2022 (UU PDP)</h5>
                  <p className="text-xs text-stone-300">Data pribadi, alamat rumah, dan nomor telepon Anda terlindungi dengan standar enkripsi tinggi.</p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Penggunaan & Keamanan Informasi
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-xs text-stone-600">
                  <li><strong>Alamat Rumah & Pin Lokasi:</strong> Hanya digunakan untuk memandu penugasan dan rute terapis yang bertugas. Data lokasi tidak pernah diperjualbelikan.</li>
                  <li><strong>Nomor WhatsApp:</strong> Hanya digunakan untuk konfirmasi status terapis OTW, rekap resi pemesanan, dan pemberitahuan garansi.</li>
                  <li><strong>Kerahasiaan Rekam Kesehatan:</strong> Informasi kontraindikasi (kehamilan, pasca-operasi) bersifat rahasia dan hanya diberikan kepada terapis bertugas.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Hak Subjek Data Anda
                </h4>
                <p className="text-stone-600 text-xs">
                  Anda berhak meminta penghapusan akun, riwayat transaksi, maupun koreksi data diri kapan saja dengan mengirimkan pesan resmi ke Tim Privasi Mimah Spa Indonesia.
                </p>
              </section>

            </div>
          )}

          {/* TAB 4: KARIR & KEMITRAAN */}
          {activeTab === 'careers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-900">Gabung Bersama Mimah Spa Indonesia</h5>
                  <p className="text-xs text-emerald-800">Peluang karir terapis profesional bersertifikat dan mitra kerjasama strategis di Medan.</p>
                </div>
              </div>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  1. Lowongan Terapis Panggilan (Full-time / Part-time)
                </h4>
                <p className="text-stone-600 text-xs">
                  Kami membuka kesempatan bagi terapis wanita berpengalaman dan bersertifikat BNSP untuk bergabung dengan tim profesional Mimah Spa di Medan.
                </p>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 text-xs text-stone-700">
                  <p className="font-bold text-stone-900">✨ Kualifikasi:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Wanita, usia maksimal 45 tahun.</li>
                    <li>Memiliki pengalaman min. 1 tahun di bidang spa, pijat tradisional, atau refleksi.</li>
                    <li>Memiliki sertifikat BNSP / pelatihan spa resmi (diutamakan).</li>
                    <li>Jujur, ramah, beretika baik, dan berpenampilan rapi.</li>
                    <li>Memiliki kendaraan pribadi untuk mobilitas panggilan di wilayah Medan.</li>
                  </ul>
                  <p className="font-bold text-emerald-800 pt-2">💰 Benefit: Bagi hasil sangat menarik, bonus performa harian, dan fleksibilitas waktu kerja.</p>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="font-extrabold text-stone-900 flex items-center gap-2 text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  2. Kemitraan Bisnis & Korporat
                </h4>
                <p className="text-stone-600 text-xs">
                  Buka kerja sama untuk event wellness kantor, hotel partner, atau penyedia produk aromaterapi dan kesehatan.
                </p>
              </section>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>Isi Form Pendaftaran Mitra</span>
                </button>
                <a
                  href="https://wa.me/6285361991731?text=Halo%20Mimah%20Spa,%20saya%20tertarik%20untuk%20bergabung%20sebagai%20Terapis%20/%20Mitra%20Kerjasama."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Chat CS via WA</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="text-[11px] font-medium text-stone-400 hidden sm:block">
            Mimah Spa Indonesia • CS: 0812-3456-7890
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            Saya Mengerti & Setuju
          </button>
        </div>

      </div>

      {/* Partner Registration Modal */}
      <TherapistRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

    </div>
  );
};

