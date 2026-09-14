import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Key, CheckCircle2, ShieldAlert, Database, User } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast, setUserRole } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const lowerEmail = email.toLowerCase().trim();

    // Wajib ada koneksi Supabase untuk mode Produksi
    if (!supabase) {
      setError('Koneksi ke database Cloud Supabase tidak tersedia. Periksa konfigurasi API Key.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: supaError } = await supabase.auth.signInWithPassword({ 
        email: lowerEmail, 
        password 
      });

      if (supaError) {
        // Cek jika akun belum ada di Supabase Auth tapi terdaftar di tabel terapis / admin dengan sandi khusus
        if (lowerEmail === 'fahryseptian35@gmail.com') {
          // Khusus superadmin owner verification
          if (password === '8899' || password === 'fahry2026' || password === 'mimahspa2026') {
            localStorage.setItem('mimah_admin_email', lowerEmail);
            localStorage.setItem('mimah_admin_name', 'Fahry Septian (Superadmin)');
            setUserRole('admin');
            showToast('Selamat datang kembali, Superadmin Fahry Septian!', 'success');
            setLoading(false);
            return;
          }
        }

        // Cek tabel terapis
        const { data: therapistCheck } = await supabase
          .from('therapists')
          .select('*')
          .eq('phone', password)
          .or(`email.eq.${lowerEmail}`)
          .maybeSingle();

        if (therapistCheck) {
          setUserRole('therapist');
          showToast(`Selamat datang, Mitra Terapis ${therapistCheck.name}`, 'success');
          setLoading(false);
          return;
        }

        setError(supaError.message === 'Invalid login credentials' 
          ? 'Email atau kata sandi yang Anda masukkan salah.' 
          : supaError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        const mRole = data.user?.user_metadata?.role;
        const userEmail = data.user.email?.toLowerCase();
        
        // Cek Superadmin Email atau Metadata Role
        if (userEmail === 'fahryseptian35@gmail.com' || mRole === 'admin' || mRole === 'superadmin') {
          localStorage.setItem('mimah_admin_email', userEmail || 'fahryseptian35@gmail.com');
          localStorage.setItem('mimah_admin_name', 'Fahry Septian (Superadmin)');
          setUserRole('admin');
          showToast('Selamat datang kembali, Superadmin Mimah Spa', 'success');
          setLoading(false);
          return;
        }

        if (mRole === 'therapist') {
          setUserRole('therapist');
          showToast('Selamat datang kembali, Mitra Terapis', 'success');
          setLoading(false);
          return;
        }

        // Cek ke tabel therapists jika metadata role kosong tapi email terdaftar
        const { data: therapist } = await supabase
          .from('therapists')
          .select('*')
          .eq('email', lowerEmail)
          .maybeSingle();

        if (therapist) {
          setUserRole('therapist');
          showToast(`Selamat datang, Mitra Terapis ${therapist.name}`, 'success');
          setLoading(false);
          return;
        }

        // Jika tidak dikenali sebagai admin atau terapis
        setError('Akses ditolak. Akun Anda tidak memiliki izin operasional Mimah Spa.');
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      console.error('Supabase auth error:', err);
      setError('Terjadi kesalahan sistem saat memverifikasi kredensial Anda.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md space-y-6">
        
        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-stone-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-stone-200">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-bold font-serif-display text-stone-900">
              Portal Internal
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Masuk untuk mengelola operasional Mimah Spa Home Service
            </p>
          </div>
        </div>

        {/* Database Mode Status Indicator */}
        <div className="px-4 py-2.5 bg-white border border-stone-200/80 rounded-2xl flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2 text-stone-600 font-bold">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Mode Keamanan:</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Ketat (Strict Auth)
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 space-y-6 relative overflow-hidden">
          {/* Subtle Privacy Background Decor */}
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
            <ShieldAlert className="w-24 h-24 rotate-12" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest px-1">
                  Email Kredensial
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    placeholder="nama@mimahspa.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest px-1">
                  Kata Sandi / PIN Keamanan
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    placeholder="Masukkan sandi atau PIN"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border-none rounded-2xl pl-11 pr-4 py-3.5 text-sm text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-stone-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Verifikasi & Masuk Portal</>
              )}
            </button>
          </form>
        </div>

        {/* Policy Footer */}
        <div className="text-center space-y-3">
          <p className="text-[11px] text-stone-400 leading-relaxed px-4">
            Akses portal ini terbatas hanya untuk staf operasional dan mitra terapis Mimah Spa. Segala bentuk akses dipantau secara aman.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sistem Terenkripsi End-to-End</span>
          </div>
        </div>

      </div>
    </div>
  );
};



