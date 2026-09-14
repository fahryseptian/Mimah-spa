import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  Radio, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Table,
  Layers
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SupabaseSchemaCenter: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const sqlScript = `-- =========================================================
-- MIMAH SPA MEDAN - FULL SUPABASE DDL MIGRATION SCRIPT
-- =========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: THERAPISTS (Mitra Terapis)
CREATE TABLE IF NOT EXISTS therapists (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    experience_years INT DEFAULT 3,
    status VARCHAR(20) DEFAULT 'online', -- 'online', 'busy', 'offline'
    gender VARCHAR(10) DEFAULT 'female',
    phone VARCHAR(30) DEFAULT '08123456789',
    base_kecamatan VARCHAR(50) DEFAULT 'Medan Helvetia',
    base_city VARCHAR(50) DEFAULT 'Medan',
    lat NUMERIC(10, 6) DEFAULT 3.5952,
    lng NUMERIC(10, 6) DEFAULT 98.6722,
    commission_rate NUMERIC(3, 2) DEFAULT 0.70,
    specialties TEXT[] DEFAULT ARRAY['Mimah Signature', 'Reflexology'],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: SERVICES (Katalog Perawatan)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL,
    price INT NOT NULL,
    image_url TEXT,
    description TEXT,
    is_popular BOOLEAN DEFAULT false,
    requires_specialist BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: BOOKINGS (Transaksi & Pemesanan)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    service_id VARCHAR(50) REFERENCES services(id),
    service_title VARCHAR(100) NOT NULL,
    service_price INT NOT NULL,
    duration_minutes INT NOT NULL,
    total_amount INT NOT NULL,
    transport_cost INT DEFAULT 0,
    estimated_distance_km NUMERIC(5, 2) DEFAULT 0,
    discount_amount INT DEFAULT 0,
    voucher_code VARCHAR(50),
    points_used INT DEFAULT 0,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(100),
    address TEXT NOT NULL,
    kecamatan VARCHAR(50) NOT NULL,
    city VARCHAR(50) DEFAULT 'Medan',
    address_notes TEXT,
    customer_lat NUMERIC(10, 6),
    customer_lng NUMERIC(10, 6),
    therapist_id VARCHAR(50) REFERENCES therapists(id),
    therapist_name VARCHAR(100),
    therapist_phone VARCHAR(30),
    therapist_photo TEXT,
    therapist_lat NUMERIC(10, 6),
    therapist_lng NUMERIC(10, 6),
    booking_date DATE NOT NULL,
    booking_time_slot VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', 
    -- 'pending', 'confirmed', 'therapist_on_the_way', 'therapist_arrived', 'in_session', 'completed', 'cancelled'
    payment_method VARCHAR(30) DEFAULT 'qris',
    payment_status VARCHAR(20) DEFAULT 'paid',
    selected_oil VARCHAR(50) DEFAULT 'Lavender Relieve',
    pressure_level VARCHAR(20) DEFAULT 'medium',
    selected_add_ons JSONB DEFAULT '[]'::jsonb,
    status_logs JSONB DEFAULT '[]'::jsonb,
    rating INT,
    review_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: VOUCHERS (Promo & Diskon)
CREATE TABLE IF NOT EXISTS vouchers (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    discount_percent INT DEFAULT 15,
    max_discount INT DEFAULT 50000,
    min_order INT DEFAULT 150000,
    valid_until DATE,
    quota INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON therapists FOR SELECT USING (true);
CREATE POLICY "Public Manage All" ON therapists FOR ALL USING (true);

CREATE POLICY "Public Read All Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Manage All Services" ON services FOR ALL USING (true);

CREATE POLICY "Public Read All Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public Manage All Bookings" ON bookings FOR ALL USING (true);

CREATE POLICY "Public Read Vouchers" ON vouchers FOR SELECT USING (true);

-- 7. ENABLE REALTIME BROADCAST
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE therapists;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE vouchers;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

-- SEED DATA AWAL (Contoh)
INSERT INTO services (id, title, category, duration_minutes, price, is_popular)
VALUES 
('srv-1', 'Traditional Javanese & North-Sumatran Massage', 'massage', 90, 195000, true),
('srv-2', 'Mimah Signature Aromatherapy Healing', 'signature', 120, 260000, true),
('srv-3', 'Mom & Postpartum Care with Herbal Compress', 'maternity', 120, 280000, false)
ON CONFLICT (id) DO NOTHING;
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-[2.5rem] p-8 sm:p-10 border border-stone-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Database Synchronization Hub</span>
                <h2 className="text-2xl font-bold font-serif-display text-white">Skema SQL & Sinkronisasi Supabase</h2>
              </div>
            </div>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed font-medium">
              Gunakan script DDL PostgreSQL di bawah ini untuk membuat tabel otomatis di dashboard Supabase Anda dengan dukungan Row Level Security (RLS) dan Realtime listener.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopy}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-900/30 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Disalin!' : 'Salin SQL Script'}</span>
            </motion.button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/15 transition-all"
            >
              <span>Buka Supabase</span>
              <ExternalLink className="w-4 h-4 text-stone-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Guide Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
            1
          </div>
          <h4 className="text-sm font-bold text-stone-900">Salin Script DDL</h4>
          <p className="text-xs text-stone-500 leading-relaxed font-medium">
            Klik tombol "Salin SQL Script" di atas untuk menyalin seluruh struktur tabel `bookings`, `therapists`, `services`, dan `vouchers`.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
            2
          </div>
          <h4 className="text-sm font-bold text-stone-900">Tempel di SQL Editor</h4>
          <p className="text-xs text-stone-500 leading-relaxed font-medium">
            Buka dashboard Supabase proyek Anda, masuk ke menu <strong>SQL Editor</strong>, buat query baru, lalu tempel (Paste) dan klik <strong>Run</strong>.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
            3
          </div>
          <h4 className="text-sm font-bold text-stone-900">Realtime Otomatis Aktif</h4>
          <p className="text-xs text-stone-500 leading-relaxed font-medium">
            Script ini secara otomatis menambahkan tabel ke `supabase_realtime` sehingga perubahan status langsung menyala tanpa refresh.
          </p>
        </div>
      </div>

      {/* Code Preview Box */}
      <div className="bg-stone-950 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-stone-400 font-mono text-xs">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>schema_mimah_spa_production.sql</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Copy'}</span>
          </button>
        </div>
        <pre className="p-6 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 no-scrollbar leading-relaxed">
          {sqlScript}
        </pre>
      </div>
    </div>
  );
};
