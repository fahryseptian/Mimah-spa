import React from 'react';
import { Star, CheckCircle, Quote, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200 mb-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Rating Rata-Rata 4.9 dari 3.800+ Pelanggan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
            Kata Pelanggan di Kota Medan & Sekitarnya
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pengalaman nyata warga Medan yang telah merasakan kenyamanan home service Mimah Spa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.slice(0, 4).map((r) => (
          <div
            key={r.id}
            className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 flex flex-col justify-between hover:border-emerald-500 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-stone-600">{r.date}</span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-stone-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{r.customerName}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Terverifikasi</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <MapPin className="w-3 h-3 text-stone-600 shrink-0" />
                <span className="truncate">{r.customerCity}</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-medium line-clamp-1">
                Layanan: {r.serviceTitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
