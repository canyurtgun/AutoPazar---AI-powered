import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Gauge, Fuel, Settings2, Car, Eye, Heart, Share2, Phone, ArrowLeft, Palette, Zap } from 'lucide-react';
import { listingsAPI, aiAPI } from '../services/endpoints';
import { Listing, AIPrediction, formatPrice, formatNumber, FUEL_TYPE_LABELS, TRANSMISSION_LABELS, BODY_TYPE_LABELS, CONDITION_LABELS, timeAgo } from '../types';
import AIPredictionPanel from '../components/ai/AIPredictionPanel';
import { useAuthStore } from '../store/authStore';
import { getVehicleImageByBrand } from '../utils/vehicleImages';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!id) return;
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const { data } = await listingsAPI.getById(id!);
      setListing(data);
      fetchAIPrediction(data);
    } catch (error) {
      console.error('İlan yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIPrediction = async (listing: Listing) => {
    setAiLoading(true);
    try {
      const { data } = await aiAPI.predict({
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        mileage: listing.mileage,
        fuelType: listing.fuelType,
        transmission: listing.transmission,
        bodyType: listing.bodyType,
        city: listing.city,
        condition: listing.condition,
        userPrice: listing.price,
      });
      setPrediction(data);
    } catch (error) {
      console.error('AI tahmin hatası:', error);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-80 shimmer rounded-2xl" />
            <div className="h-8 shimmer rounded w-3/4" />
            <div className="h-4 shimmer rounded w-1/2" />
          </div>
          <div className="h-96 shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-24 pt-32">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Car className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 font-display">İlan Bulunamadı</h2>
        <Link to="/ilanlar" className="text-primary-light hover:text-white transition-colors font-medium">İlanlara Dön</Link>
      </div>
    );
  }

  // Resolve image URL
  let resolvedImage = '';
  if (listing.images) {
    if (typeof listing.images === 'string') {
      try {
        const parsed = JSON.parse(listing.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resolvedImage = parsed[0];
        }
      } catch (e) {
        // Fallback
      }
    } else if (Array.isArray(listing.images) && listing.images.length > 0) {
      resolvedImage = listing.images[0];
    }
  }
  if (!resolvedImage) {
    resolvedImage = getVehicleImageByBrand(listing.brand);
  }

  const specs = [
    { icon: <Calendar className="w-4 h-4" />, label: 'Yıl', value: listing.year, color: 'text-primary-light' },
    { icon: <Gauge className="w-4 h-4" />, label: 'Kilometre', value: `${formatNumber(listing.mileage)} km`, color: 'text-secondary-light' },
    { icon: <Fuel className="w-4 h-4" />, label: 'Yakıt', value: FUEL_TYPE_LABELS[listing.fuelType], color: 'text-accent-light' },
    { icon: <Settings2 className="w-4 h-4" />, label: 'Vites', value: TRANSMISSION_LABELS[listing.transmission], color: 'text-primary-light' },
    { icon: <Car className="w-4 h-4" />, label: 'Kasa', value: BODY_TYPE_LABELS[listing.bodyType], color: 'text-secondary-light' },
    { icon: <Palette className="w-4 h-4" />, label: 'Renk', value: listing.color || '-', color: 'text-accent-light' },
    { icon: <Zap className="w-4 h-4" />, label: 'Motor', value: listing.engineSize || '-', color: 'text-primary-light' },
    { icon: <Zap className="w-4 h-4" />, label: 'Beygir', value: listing.horsePower ? `${listing.horsePower} HP` : '-', color: 'text-secondary-light' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-28">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-xs text-text-secondary mb-5"
      >
        <Link to="/ilanlar" className="flex items-center gap-1 hover:text-primary-light transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          İlanlar
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-white font-medium">{listing.brand} {listing.model}</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden border border-white/[0.06] group"
          >
            <img
              src={resolvedImage}
              alt={`${listing.brand} ${listing.model}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-light/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {listing.condition === 'SIFIR' && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-500/30">
                Sıfır Araç
              </span>
            )}

            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 transition-all duration-300 border border-white/10">
                <Heart className="w-4.5 h-4.5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 transition-all duration-300 border border-white/10">
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>

          {/* Title & Price */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 sm:p-6"
          >
            <span className="text-xs text-primary-light font-bold uppercase tracking-widest mb-2 block">
              {listing.brand} {listing.model} • {listing.year}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 font-display">{listing.title}</h1>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-extrabold text-white font-display">{formatPrice(listing.price)}</p>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary font-medium">
                {CONDITION_LABELS[listing.condition]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-white/[0.04] text-xs text-text-secondary">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-text-muted" />{listing.city}{listing.district ? `, ${listing.district}` : ''}</span>
              <span className="hidden sm:inline text-text-muted">•</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-text-muted" />{listing.viewCount} görüntülenme</span>
              <span className="hidden sm:inline text-text-muted">•</span>
              <span>Yayınlanma: {timeAgo(listing.createdAt)}</span>
            </div>
          </motion.div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {specs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
              >
                <div className={`flex items-center gap-1.5 mb-1.5 text-[11px] text-text-muted`}>
                  <span className={`${spec.color} group-hover:scale-110 transition-transform`}>{spec.icon}</span>
                  <span>{spec.label}</span>
                </div>
                <p className="text-sm font-bold text-white">{spec.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
          >
            <h2 className="text-base font-bold text-white mb-3 font-display">Açıklama</h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Prediction Panel */}
          <AIPredictionPanel prediction={prediction!} isLoading={aiLoading || !prediction} />

          {/* Seller Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-display">Satıcı Bilgileri</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-base shadow-lg shadow-primary/15 ring-1 ring-white/10">
                {listing.user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{listing.user?.fullName}</p>
                <p className="text-[10px] text-text-muted">Kayıt: {listing.user?.createdAt ? timeAgo(listing.user.createdAt) : '-'}</p>
              </div>
            </div>

            {isAuthenticated && listing.user?.phone && (
              <a
                href={`tel:${listing.user.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-emerald-400/20"
              >
                <Phone className="w-4 h-4" />
                İletişime Geç: {listing.user.phone}
              </a>
            )}
            {!isAuthenticated && (
              <Link
                to="/giris"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-white/10"
              >
                Telefon Numarasını Görmek İçin Giriş Yap
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
