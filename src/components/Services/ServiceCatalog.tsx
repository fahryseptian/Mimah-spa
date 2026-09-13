import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Footprints, 
  Activity, 
  Baby, 
  ShieldAlert, 
  Stethoscope, 
  Sparkles, 
  Users, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  UserCheck,
  Flame,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const ServiceCatalog: React.FC = () => {
  const { 
    services, 
    setSelectedServiceForBooking, 
    setIsBookingModalOpen,
    selectedCity 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDurationMap, setSelectedDurationMap] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: 'Semua Layanan' },
    { id: 'pijat_tradisional', label: 'Pijat Tradisional' },
    { id: 'refleksi', label: 'Refleksi Kaki' },
    { id: 'deep_tissue', label: 'Deep Tissue & Sport' },
    { id: 'mom_baby', label: 'Ibu Hamil & Bayi' },
    { id: 'bekam_kerokan', label: 'Bekam & Kerokan' },
    { id: 'fisioterapi', label: 'Fisioterapi Medis' },
    { id: 'totok_lulur', label: 'Totok & Lulur Spa' },
    { id: 'paket_hemat', label: 'Paket Hemat Duo' },
    { id: 'mimah_signature', label: 'Mimah Signature ✨' },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  const handleSelectService = (service: ServiceItem, durationMinutes: number) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Katalog Resmi Mimah Spa</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif-display text-stone-900 leading-tight">
          Layanan Terapi & Pijat Premium
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Setiap pemesanan sudah termasuk paket higienitas lengkap: matras steril, sprei disposable, kain penutup, dan aromaterapi alami berkualitas.
        </p>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
              activeCategory === cat.id
                ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-800/20 border-emerald-700 scale-[1.02]'
                : 'bg-white text-stone-500 hover:bg-stone-50 border-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((service) => {
          // Selected duration state for this specific card
          const currentDuration = selectedDurationMap[service.id] || service.durationOptions[0].durationMinutes;
          const currentDurationObj = service.durationOptions.find(d => d.durationMinutes === currentDuration) || service.durationOptions[0];

          return (
            <div
              key={service.id}
              className="group bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col h-full"
            >
              {/* Card Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {getServiceIcon(service.iconName)}
                    <span>{service.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 rounded-xl bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Khusus Wanita
                  </div>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="text-2xl font-bold font-serif-display leading-tight">{service.title}</h3>
                  <p className="text-stone-200 text-sm opacity-90">{service.tagline}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <p className="text-sm text-stone-500 leading-relaxed font-medium italic">
                    "{service.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {service.benefits.slice(0, 4).map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[11px] font-bold text-stone-600 leading-tight">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Pilih Durasi</span>
                    <span className="px-2 py-1 rounded-lg bg-stone-50 text-stone-600 text-[10px] font-bold border border-stone-100">
                      Terpopuler
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {service.durationOptions.map((opt) => (
                      <button
                        key={opt.durationMinutes}
                        onClick={() => setSelectedDurationMap({
                          ...selectedDurationMap,
                          [service.id]: opt.durationMinutes
                        })}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                          currentDuration === opt.durationMinutes
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 scale-[1.05] shadow-md shadow-emerald-600/10'
                            : 'border-stone-50 hover:border-stone-200 text-stone-400 bg-stone-50/50'
                        }`}
                      >
                        <span className="text-xs font-bold">{opt.durationMinutes}m</span>
                        <span className={`text-[9px] font-bold uppercase mt-1 ${currentDuration === opt.durationMinutes ? 'text-emerald-700' : 'text-stone-400'}`}>
                          {formatRupiah(opt.price).replace('Rp ', '')}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Estimasi Total</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-stone-900 leading-none">{formatRupiah(currentDurationObj.price)}</span>
                        {currentDurationObj.originalPrice && (
                          <span className="text-sm text-stone-300 line-through font-medium">
                            {formatRupiah(currentDurationObj.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectService(service, currentDuration)}
                      className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-700/20 flex items-center gap-2 group active:scale-95 transition-all"
                    >
                      <span>Booking</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
