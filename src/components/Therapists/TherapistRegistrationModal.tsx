import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Briefcase, 
  Send, 
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TherapistRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistRegistrationModal: React.FC<TherapistRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { submitTherapistApplication, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(25);
  const [kecamatan, setKecamatan] = useState('Medan Baru');
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [certifications, setCertifications] = useState('');
  const [motivation, setMotivation] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    'Pijat Tradisional Medan',
    'Refleksi Kaki'
  ]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const ALL_SPECIALTIES = [
    'Pijat Tradisional Medan',
    'Refleksi Kaki',
    'Pijat Ibu Hamil / Postpartum',
    'Pijat Bayi & Anak',
    'Deep Tissue / Sport Massage',
    'Fisioterapi Medis',
    'Bekam Steril',
    'Lulur & Scrub Body Care'
  ];

  const handleSpecialtyToggle = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast('Harap lengkapi semua data wajib!', 'error');
      return;
    }

    if (phone.length < 9) {
      showToast('Nomor WhatsApp tidak valid', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Anda harus menyetujui syarat kemitraan', 'error');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      submitTherapistApplication({
        fullName,
        phone,
        email,
        gender: 'female',
        age,
        city: 'Medan',
        kecamatan,
        experienceYears,
        specialties: selectedSpecialties,
        certifications: certifications || 'Sertifikat Pelatihan Spa',
        motivation: motivation || 'Ingin menambah penghasilan dan memberikan pelayanan pijat profesional.'
      });

      setLoading(false);
      setIsSubmitted(true);
      showToast('Pendaftaran Mitra Terapis Berhasil Dikirim!', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-emerald-300 border border-white/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-display">Pendaftaran Mitra Terapis</h3>
              <p className="text-xs text-emerald-200/80">Gabung Tim Profesional Mimah Spa Medan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 font-serif-display">
                Pendaftaran Berhasil Dikirim!
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Terima kasih <strong>{fullName}</strong>. Data lamaran Anda telah tersimpan di sistem seleksi Tim HR Mimah Spa. Kami akan memverifikasi dokumen Anda dan menghubungi via WhatsApp dalam 1x24 jam.
              </p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tahap Selanjutnya:</span>
                </div>
                <ul className="list-disc pl-5 text-stone-700 space-y-1">
                  <li>Verifikasi KTP & Sertifikat via WhatsApp</li>
                  <li>Uji Praktik & Higienitas Koper Steril</li>
                  <li>Aktivasi Akun Portal Mitra Terapis</li>
                </ul>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <a
                  href={`https://wa.me/6285361991731?text=Halo%20Admin%20Mimah%20Spa,%20saya%20sudah%20mengirimkan%20pendaftaran%20mitra%20terapis%20atas%20nama%20${encodeURIComponent(fullName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Konfirmasi via WA CS</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Highlight Info Box */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Syarat Khusus Mitra:</strong> Khusus terapis wanita, berdomisili di area Kota Medan/sekitarnya, ramah, dan memiliki sertifikat/keahlian di bidang pijat atau perawatan tubuh.
                </div>
              </div>

              {/* SECTION 1: Personal Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>1. Identitas Diri</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama Lengkap (Sesuai KTP) *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Siti Rahmawati"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      No. WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      placeholder="email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Usia (Tahun) *
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={50}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Kecamatan Domisili di Medan *
                    </label>
                    <select
                      value={kecamatan}
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Medan Baru">Medan Baru</option>
                      <option value="Medan Johor">Medan Johor</option>
                      <option value="Medan Polonia">Medan Polonia</option>
                      <option value="Medan Petisah">Medan Petisah</option>
                      <option value="Medan Helvetia">Medan Helvetia</option>
                      <option value="Medan Selayang">Medan Selayang</option>
                      <option value="Medan Tuntungan">Medan Tuntungan</option>
                      <option value="Medan Sunggal">Medan Sunggal</option>
                      <option value="Medan Kota">Medan Kota</option>
                      <option value="Medan Denai">Medan Denai</option>
                      <option value="Medan Amplas">Medan Amplas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Experience & Specialties */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>2. Pengalaman & Keahlian</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Lama Pengalaman Pijat / Spa *
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value={1}>1 Tahun</option>
                      <option value={2}>2 - 3 Tahun</option>
                      <option value={4}>4 - 5 Tahun</option>
                      <option value={6}>Lebih dari 5 Tahun</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Sertifikat / Pelatihan yang Dimiliki
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: BNSP / Kemenkes / Sertifikat LPK"
                      value={certifications}
                      onChange={(e) => setCertifications(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Pilih Spesialisasi Layanan yang Dikuasai:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_SPECIALTIES.map((spec) => {
                      const isSelected = selectedSpecialties.includes(spec);
                      return (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => handleSpecialtyToggle(spec)}
                          className={`p-2.5 rounded-xl border text-[11px] font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <span className="truncate pr-1">{spec}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Singkat tentang Pengalaman & Motivasi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ceritakan pengalaman kerja pijat sebelumnya atau alasan ingin bergabung..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                    required
                  />
                  <span className="text-xs text-stone-600 leading-relaxed">
                    Saya menyatakan data yang diisi adalah benar, bersedia mengikuti tes wawancara & praktek, serta mematuhi kode etik profesionalisme Mitra Terapis Mimah Spa Medan.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Lamaran Mitra</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
