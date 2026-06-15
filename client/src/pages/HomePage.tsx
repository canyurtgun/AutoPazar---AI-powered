import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Car, Shield, TrendingUp, ChevronRight, Zap, BarChart3, Users, ArrowRight } from 'lucide-react';
import { listingsAPI, aiAPI } from '../services/endpoints';
import { Listing, formatPrice, formatNumber } from '../types';
import ListingCard from '../components/listing/ListingCard';

export default function HomePage() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    listingsAPI.getAll({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' } as any)
      .then(({ data }) => setFeaturedListings(data.listings))
      .catch(console.error);

    aiAPI.getMarketStats()
      .then(({ data }) => setStats(data))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ilanlar?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { label: 'Sedan', icon: <Car className="w-5 h-5" />, filter: 'bodyType=SEDAN' },
    { label: 'SUV', icon: <Sparkles className="w-5 h-5" />, filter: 'bodyType=SUV' },
    { label: 'Hatchback', icon: <Zap className="w-5 h-5" />, filter: 'bodyType=HATCHBACK' },
    { label: 'Elektrikli', icon: <Zap className="w-5 h-5" />, filter: 'fuelType=ELEKTRIK' },
    { label: 'Hibrit', icon: <Sparkles className="w-5 h-5" />, filter: 'fuelType=HYBRID' },
    { label: 'Dizel', icon: <BarChart3 className="w-5 h-5" />, filter: 'fuelType=DIZEL' },
  ];

  return (
    <div className="min-h-screen">
      {/* ════════ PREMIUM HERO ════════ */}
      <section className="relative overflow-hidden pt-32 pb-28 sm:pt-44 sm:pb-36">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-mesh"></div>
        <div className="absolute inset-0 tech-grid opacity-[0.06]"></div>

        {/* Floating Orbs */}
        <div className="orb orb-float w-[500px] h-[500px] bg-primary/[0.07] -top-48 -left-48"></div>
        <div className="orb orb-float-alt w-[400px] h-[400px] bg-secondary/[0.06] top-20 -right-32"></div>
        <div className="orb orb-float w-[300px] h-[300px] bg-accent/[0.04] -bottom-20 left-1/3"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* AI Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.08] border border-primary/20 text-primary-light text-xs font-semibold mb-8 shadow-sm backdrop-blur-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary-light pulse-dot"></div>
              Yapay Zeka Destekli Fiyat Tahmin Motoru
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-7 font-display">
              <span className="text-white">Geleceğin Otomobil</span>
              <br />
              <span className="bg-gradient-to-r from-primary-light via-secondary-light to-primary-light bg-clip-text text-transparent bg-[length:200%] animate-[gradient-shift_4s_ease_infinite]">
                Pazarı ile Tanışın
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed"
            >
              AutoPazar, derin öğrenme algoritmaları ile araçların gerçek piyasa değerini saniyeler içinde analiz eder. Güvenle alın, kârla satın.
            </motion.p>

            {/* Premium Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-2xl shadow-black/30 backdrop-blur-xl hover:border-white/[0.12] focus-within:border-primary/30 focus-within:shadow-[0_8px_40px_rgba(59,130,246,0.08)] transition-all duration-500">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Marka, model veya anahtar kelime arayın..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent text-white placeholder:text-text-muted focus:outline-none text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center gap-1.5 shrink-0 hover:-translate-y-0.5 ring-1 ring-white/10"
                >
                  Ara
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* ════════ FLOATING STATS ════════ */}
      {stats && (
        <section className="relative z-20 -mt-14 mb-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-premium rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Car className="w-6 h-6" />, value: stats.totalListings, label: 'Sistemdeki İlan', color: 'text-primary-light', bg: 'from-primary/10 to-primary/5' },
              { icon: <BarChart3 className="w-6 h-6" />, value: formatPrice(stats.averagePrice), label: 'Ortalama Piyasa', color: 'text-accent-light', bg: 'from-accent/10 to-accent/5', raw: true },
              { icon: <Users className="w-6 h-6" />, value: stats.topBrands?.length || 0, label: 'Farklı Marka', color: 'text-secondary-light', bg: 'from-secondary/10 to-secondary/5' },
              { icon: <Sparkles className="w-6 h-6" />, value: 'Aktif', label: 'AI Motor Durumu', color: 'text-success', bg: 'from-success/10 to-success/5', raw: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-b ${stat.bg} border border-white/[0.04] mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-lg sm:text-xl font-extrabold text-white mb-0.5 tracking-tight font-display">
                  {stat.raw ? stat.value : formatNumber(stat.value as number)}
                </p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ════════ CATEGORIES ════════ */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1 font-display">Segmentler</h2>
              <p className="text-xs text-text-secondary">Size en uygun araç tipini seçin</p>
            </div>
            <Link to="/ilanlar" className="text-xs text-primary-light hover:text-white font-bold flex items-center gap-1 transition-colors group">
              Tümünü Keşfet <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <Link
                  to={`/ilanlar?${cat.filter}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-primary/30 hover:shadow-[0_0_24px_rgba(59,130,246,0.06)] transition-all duration-400 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center text-text-secondary group-hover:text-primary-light group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-text-secondary group-hover:text-white transition-colors tracking-wide">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURED LISTINGS ════════ */}
      <section className="py-16 relative">
        {/* Section background */}
        <div className="absolute inset-0">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"></div>
          <div className="h-full bg-white/[0.01]"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1 font-display">Vitrindekiler</h2>
              <p className="text-xs text-text-secondary">Sisteme yeni eklenen seçkin ilanlar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/ilanlar" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-semibold text-white hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300 group">
              Tüm İlanları Görüntüle
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Background orb */}
        <div className="orb orb-float-alt w-[500px] h-[500px] bg-secondary/[0.04] top-0 right-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 font-display">
              Neden <span className="gradient-text-hero">AutoPazar?</span>
            </h2>
            <p className="text-sm text-text-secondary">Eski nesil araç alım satımını unutun. Yapay zeka ile geleceğin ticaret deneyimini sunuyoruz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Nöral Fiyat Analizi',
                desc: 'Milyonlarca veri noktasını analiz eden modelimiz, aracın gerçek piyasa değerini %95 güven aralığı ile tahmin eder.',
                color: 'text-primary-light',
                borderGlow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.06)]',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Güven Kalkanı',
                desc: 'Blokzincir tabanlı değil ama en az onun kadar güvenli. Profil doğrulaması ve dolandırıcılık tespiti aktif.',
                color: 'text-secondary-light',
                borderGlow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Işık Hızında Alım',
                desc: 'Optimize edilmiş veritabanı mimarisi ve mikroservis altyapısı sayesinde kesintisiz, anında sonuçlanan işlemler.',
                color: 'text-accent-light',
                borderGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`p-7 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] hover:-translate-y-1.5 transition-all duration-500 group card-shine ${feature.borderGlow}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/[0.06] transition-all duration-300 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2.5 font-display">{feature.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="pb-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06]">
            {/* CTA Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-light via-surface-card to-surface-light"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.06]"></div>
            <div className="orb w-[300px] h-[300px] bg-primary/[0.08] -top-20 -right-20" style={{filter: 'blur(60px)'}}></div>
            <div className="orb w-[200px] h-[200px] bg-secondary/[0.06] -bottom-16 -left-16" style={{filter: 'blur(50px)'}}></div>

            <div className="relative z-10 p-10 md:p-16 text-center">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 font-display">
                Zaman Kaybetmeyin
              </h2>
              <p className="text-sm text-text-secondary mb-10 max-w-lg mx-auto">
                Aracınızı hemen sisteme ekleyin, yapay zekamız değerini belirlesin, alıcılar sizinle anında iletişime geçsin.
              </p>
              <Link
                to="/ilan-olustur"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-slate-950 font-bold text-sm hover:scale-[1.03] transition-all duration-300 shadow-xl shadow-white/10 ring-1 ring-white/20"
              >
                <TrendingUp className="w-5 h-5 text-slate-900" />
                Hemen İlan Ver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
