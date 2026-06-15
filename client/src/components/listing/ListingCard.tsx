import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Gauge, Fuel, Heart, Eye, Sparkles } from 'lucide-react';
import { Listing, formatPrice, formatNumber, FUEL_TYPE_LABELS } from '../../types';
import { getVehicleImageByBrand } from '../../utils/vehicleImages';

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export default function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const hasAIPrice = listing.aiPredictedPrice && listing.aiPredictedPrice > 0;
  const priceRatio = hasAIPrice ? listing.price / listing.aiPredictedPrice! : 1;

  let priceBadge = null;
  if (hasAIPrice) {
    if (priceRatio < 0.9) {
      priceBadge = { text: 'İyi Fiyat', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', glow: 'shadow-emerald-500/10' };
    } else if (priceRatio > 1.1) {
      priceBadge = { text: 'Piyasa Üstü', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', glow: 'shadow-amber-500/10' };
    } else {
      priceBadge = { text: 'Normal Fiyat', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', glow: 'shadow-blue-500/10' };
    }
  }

  // Resolve Image URL safely
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link to={`/ilan/${listing.id}`} className="block h-full group relative">
        {/* Hover glow effect */}
        <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <div className="relative h-full flex flex-col rounded-2xl bg-surface-light/80 border border-white/[0.04] group-hover:border-primary/20 transition-all duration-500 overflow-hidden card-shine">
          {/* Vehicle Image */}
          <div className="relative h-48 overflow-hidden bg-surface">
            <img
              src={resolvedImage}
              alt={`${listing.brand} ${listing.model}`}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Multi-layer overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-surface-light/20 to-transparent opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Status badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              {listing.condition === 'SIFIR' && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-500/30">
                  Sıfır
                </span>
              )}
            </div>

            {/* Favorite count */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold ring-1 ring-white/10">
              <Heart className="w-3 h-3 text-secondary-light group-hover:fill-secondary-light group-hover:scale-110 transition-all duration-300" />
              {listing._count?.favorites || 0}
            </div>

            {/* AI Price badge overlay */}
            {priceBadge && (
              <div className={`absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold backdrop-blur-md shadow-lg ${priceBadge.color} ${priceBadge.glow}`}>
                <Sparkles className="w-3 h-3" />
                {priceBadge.text}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Brand & Model Tag */}
            <span className="text-[10px] text-primary-light font-bold uppercase tracking-widest mb-1.5">
              {listing.brand} {listing.model}
            </span>

            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 min-h-[40px] mb-3 group-hover:text-primary-light transition-colors duration-300">
              {listing.title}
            </h3>

            {/* Clean Specifications Row */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 text-[11px] text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span>{listing.year} model</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="truncate">{formatNumber(listing.mileage)} km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="truncate">{FUEL_TYPE_LABELS[listing.fuelType] || listing.fuelType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="truncate">{listing.city}</span>
              </div>
            </div>

            {/* Price & Footnote */}
            <div className="mt-auto pt-3 border-t border-white/[0.04] flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5 font-medium">Fiyat</span>
                <p className="text-base font-extrabold text-white font-display">
                  {formatPrice(listing.price)}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-text-muted">
                <Eye className="w-3 h-3" />
                <span>{formatNumber(listing.viewCount)}</span>
              </div>
            </div>

            {hasAIPrice && (
              <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-white/[0.03]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></div>
                <p className="text-[10px] text-text-muted font-medium">
                  AI Değeri: <span className="text-white font-semibold">{formatPrice(listing.aiPredictedPrice!)}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
