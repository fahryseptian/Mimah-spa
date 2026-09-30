import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah saya perlu menyediakan matras, kain, atau minyak sendiri?',
      a: 'Tidak perlu. Mitra terapis Mimah Spa datang membawa koper lengkap berisi matras busa medis lipat portabel, sprei dan sarung bantal higienis sekali pakai (disposable), kain penutup bersih bersegel, serta minyak aromaterapi alami berkualitas premium yang aman dan menenangkan.'
    },
    {
      q: 'Apakah bisa memilih khusus terapis wanita untuk klien wanita?',
      a: 'Bisa dan sangat dianjurkan. Kami menjunjung tinggi norma kesopanan dan syar\'i/muhrim. Anda dapat memilih filter "Khusus Terapis Wanita" saat melakukan pemesanan.'
    },
    {
      q: 'Berapa biaya transportasi terapis ke alamat saya di Medan?',
      a: 'Biaya transportasi dihitung transparan berdasarkan jarak rute jalan raya (bukan garis lurus) dari pos mitra terapis terdekat di Medan. Tarif dasar minimal Rp 10.000 untuk jarak ≤ 3 km, dan di atas 3 km ditambah biaya jarak Rp 2.500/km tanpa markup.'
    },
    {
      q: 'Bagaimana standar kualifikasi mitra terapis Mimah Spa?',
      a: '100% mitra terapis kami telah melewati verifikasi identitas KTP & SKCK Kepolisian, uji kompetensi pijat kebugaran resmi BNSP (Badan Nasional Sertifikasi Profesi), serta pelatihan higienitas medis.'
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Kami menerima pembayaran non-tunai yang aman melalui QRIS (bisa di-scan dari BCA, Mandiri, BRI, GoPay, OVO, ShopeePay), maupun Transfer Bank Virtual Account / Manual.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Pertanyaan Umum (FAQ)</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold font-serif-display text-stone-900">
          Hal yang Sering Ditanyakan Sebelum Memesan
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Jawaban lengkap mengenai kebersihan, perlengkapan koper steril, dan jaminan keamanan layanan kami.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left bg-stone-50/70 hover:bg-stone-50 flex items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-stone-900">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-600 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed bg-white border-t border-stone-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
