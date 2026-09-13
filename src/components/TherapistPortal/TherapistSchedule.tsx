import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  therapistId: string;
}

export const TherapistSchedule: React.FC<Props> = ({ therapistId }) => {
  const { therapists, updateTherapistSchedule, showToast } = useApp();
  const therapist = therapists.find(t => t.id === therapistId);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Initialize schedule from therapist data or default
  const [localSchedule, setLocalSchedule] = useState<Record<string, string[]>>(() => {
    if (therapist?.schedule) return therapist.schedule;
    
    // Default: 09:00 - 21:00 on weekdays
    const defaultSchedule: Record<string, string[]> = {};
    days.forEach(day => {
      if (day === 'Minggu') {
        defaultSchedule[day] = [];
      } else {
        defaultSchedule[day] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
      }
    });
    return defaultSchedule;
  });

  const toggleSlot = (day: string, slot: string) => {
    setLocalSchedule(prev => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot].sort() };
      }
    });
  };

  const toggleDay = (day: string) => {
    setLocalSchedule(prev => {
      const daySlots = prev[day] || [];
      if (daySlots.length > 0) {
        return { ...prev, [day]: [] };
      } else {
        return { ...prev, [day]: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'] };
      }
    });
  };

  const handleSave = () => {
    updateTherapistSchedule(therapistId, localSchedule);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-premium space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 font-serif-display">Ketersediaan Jadwal</h3>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Atur Jam Kerja & Hari Libur Anda</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Jadwal Baru</span>
          </motion.button>
        </div>

        <div className="space-y-6">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                    (localSchedule[day] || []).length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-50 text-stone-400'
                  }`}>
                    {day.substring(0, 3)}
                  </div>
                  <h4 className="font-bold text-stone-900">{day}</h4>
                </div>
                <button 
                  onClick={() => toggleDay(day)}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                    (localSchedule[day] || []).length > 0 
                      ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' 
                      : 'border-stone-200 text-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {(localSchedule[day] || []).length > 0 ? 'Atur Libur' : 'Aktifkan Hari'}
                </button>
              </div>

              {(localSchedule[day] || []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = (localSchedule[day] || []).includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 text-center flex items-center justify-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                  <Coffee className="w-3.5 h-3.5" />
                  Status: Libur (Tidak menerima order)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-3">
          <Sun className="w-5 h-5 text-emerald-600" />
          <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Shift Pagi</div>
          <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">Pukul 08:00 - 14:00 biasanya memiliki permintaan tinggi untuk layanan Totok Wajah & Refleksi.</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
          <Moon className="w-5 h-5 text-blue-600" />
          <div className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Shift Malam</div>
          <p className="text-[10px] text-blue-700 font-medium leading-relaxed">Pukul 18:00 - 22:00 adalah jam sibuk untuk Pijat Tradisional & Mimah Signature. Pastikan ketersediaan Anda!</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Update Rutin</div>
          <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Perbarui jadwal Anda setiap minggu agar admin dapat mengalokasikan pesanan dengan akurat.</p>
        </div>
      </div>
    </div>
  );
};
