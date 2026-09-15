import React from 'react';
import { Star, CheckCircle, Quote, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews } = useApp();

  return (
    <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 sm:p-12 shadow-premium space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-xs font-bold border border-amber-200/80 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Rating 4.9 / 5.0 dari 3.800+ Ulasan Asli Pelanggan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900">
            Kisah Relaksasi Pelanggan Mimah Spa Medan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pengalaman nyata warga Kota Medan yang telah merasakan kenyamanan pijat home service bintang lima.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.slice(0, 4).map((r) => (
          <div
            key={r.id}
            className="group bg-stone-50/70 rounded-3xl p-6 border border-stone-100 flex flex-col justify-between hover:bg-white hover:border-emerald-200 hover:shadow-soft transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-stone-400 font-medium">{r.date}</span>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-stone-200 absolute -top-2 -left-2 -z-0" />
                <p className="text-xs text-stone-700 leading-relaxed font-medium relative z-10 pl-2">
                  "{r.comment}"
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{r.customerName}</span>
                {r.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Terverifikasi</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="truncate">{r.customerCity}</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-bold line-clamp-1 pt-0.5">
                {r.serviceTitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
