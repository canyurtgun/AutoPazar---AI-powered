import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus, BarChart3, Target, Info, Activity } from 'lucide-react';
import { AIPrediction, formatPrice, formatNumber } from '../../types';

interface AIPredictionPanelProps {
  prediction: AIPrediction;
  isLoading?: boolean;
}

export default function AIPredictionPanel({ prediction, isLoading }: AIPredictionPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl overflow-hidden">
        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30">
          <div className="bg-surface-light rounded-[calc(1rem-1px)] p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-card border border-white/[0.04]" />
              <div className="h-4 w-32 bg-surface-card rounded" />
            </div>
            <div className="h-16 w-full bg-surface-card rounded-xl" />
            <div className="space-y-2.5">
              <div className="h-3.5 w-full bg-surface-card rounded" />
              <div className="h-3.5 w-5/6 bg-surface-card rounded" />
              <div className="h-3.5 w-4/6 bg-surface-card rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { prediction: pred, comparisons, priceAssessment } = prediction;

  if (pred.sampleCount === 0) {
    return (
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        <div className="bg-surface-light rounded-[calc(1rem-1px)] p-6 text-center py-10">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-surface-card flex items-center justify-center border border-white/[0.04]">
            <Info className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-sm text-white font-bold">Yetersiz Analiz Verisi</p>
          <p className="text-xs text-text-secondary mt-1.5 max-w-[200px] mx-auto">Bu araç modeli için henüz yeterli piyasa verisi bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  const confidenceColor =
    pred.confidenceLevel === 'YÜKSEK' ? 'text-emerald-400' :
    pred.confidenceLevel === 'ORTA' ? 'text-amber-400' : 'text-rose-400';

  const confidenceBg =
    pred.confidenceLevel === 'YÜKSEK' ? 'from-emerald-500 to-emerald-400' :
    pred.confidenceLevel === 'ORTA' ? 'from-amber-500 to-amber-400' : 'from-rose-500 to-rose-400';

  const trendIcon =
    pred.trend.direction === 'UP' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
    pred.trend.direction === 'DOWN' ? <TrendingDown className="w-4 h-4 text-rose-400" /> :
    <Minus className="w-4 h-4 text-text-muted" />;

  const trendColor =
    pred.trend.direction === 'UP' ? 'text-emerald-400' :
    pred.trend.direction === 'DOWN' ? 'text-rose-400' : 'text-text-muted';

  const trendLabel =
    pred.trend.direction === 'UP' ? 'Yükseliş Trendi' :
    pred.trend.direction === 'DOWN' ? 'Düşüş Trendi' : 'Stabil Seyir';

  // Price range bar position
  const rangeWidth = pred.maxPrice - pred.minPrice;
  const avgPosition = rangeWidth > 0 ? ((pred.averagePrice - pred.minPrice) / rangeWidth) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Animated gradient border wrapper */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40 shadow-xl shadow-primary/5" style={{
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 5s ease infinite'
      }}>
        <div className="bg-surface-light rounded-[calc(1rem-1px)] p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-light animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-display">AI Değerleme Raporu</h3>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{pred.sampleCount} araç analiz edildi</p>
              </div>
            </div>

            {priceAssessment && (
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 text-center shadow-sm ${
                priceAssessment === 'UYGUN FİYAT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' :
                priceAssessment === 'PİYASA ÜSTÜNDE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5' :
                'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5'
              }`}>
                {priceAssessment === 'UYGUN FİYAT' ? 'Fırsat İlanı' :
                 priceAssessment === 'PİYASA ÜSTÜNDE' ? 'Piyasa Üstü' : 'Normal Fiyat'}
              </div>
            )}
          </div>

          {/* Price Display */}
          <div className="text-center p-6 rounded-xl bg-gradient-to-b from-surface-card to-surface-card/50 border border-white/[0.04] mb-6 relative overflow-hidden">
            {/* Subtle glow behind price */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none"></div>
            <p className="text-[10px] text-text-secondary mb-1.5 uppercase tracking-widest font-bold relative z-10">Öngörülen Ortalama Değer</p>
            <h2 className="text-3xl font-black text-white tracking-tight mb-1.5 font-display relative z-10">
              {formatPrice(pred.averagePrice)}
            </h2>
            <p className="text-xs font-semibold text-text-secondary relative z-10">
              Medyan Değer: <span className="text-white">{formatPrice(pred.medianPrice)}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* Confidence Level */}
            <div className="p-3.5 rounded-xl bg-surface-card/60 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  Doğruluk Payı
                </span>
                <span className={`text-xs font-bold ${confidenceColor}`}>
                  {Math.round(pred.confidenceScore * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidenceScore * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${confidenceBg} shadow-sm`}
                  style={{ boxShadow: `0 0 8px rgba(16, 185, 129, 0.2)` }}
                />
              </div>
            </div>

            {/* Trend */}
            <div className="p-3.5 rounded-xl bg-surface-card/60 border border-white/[0.04] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900/60 flex items-center justify-center shrink-0 border border-white/[0.04]">
                {trendIcon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Piyasa Eğilimi</p>
                <p className={`text-xs font-bold truncate ${trendColor}`}>{trendLabel}</p>
              </div>
            </div>
          </div>

          {/* Corridor */}
          <div className="mb-6 p-4 rounded-xl bg-surface-card/60 border border-white/[0.04]">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-secondary-light" />
                Fiyat Koridoru
              </span>
              <span className="text-[9px] text-text-muted border border-white/[0.06] px-2 py-0.5 rounded-md font-medium">95% GÜVEN</span>
            </div>
            <div className="relative pt-5 pb-1">
              <div className="absolute top-0 left-0 text-[10px] font-semibold text-text-secondary">{formatPrice(pred.minPrice)}</div>
              <div className="absolute top-0 right-0 text-[10px] font-semibold text-text-secondary">{formatPrice(pred.maxPrice)}</div>

              <div className="w-full h-2.5 rounded-full bg-slate-900/80 relative overflow-hidden">
                <div className="absolute inset-x-4 inset-y-0 bg-gradient-to-r from-emerald-500/25 via-primary/35 to-amber-500/25 rounded-full"></div>
              </div>

              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `${avgPosition}%` }}
                transition={{ duration: 1, type: 'spring', stiffness: 60 }}
                className="absolute top-[23px] -translate-x-1/2 flex flex-col items-center"
              >
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-primary shadow-lg shadow-primary/30 z-10" />
                <div className="bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-md text-[8px] font-bold text-white mt-1.5 shadow-sm">
                  ORT.
                </div>
              </motion.div>
            </div>
          </div>

          {/* Comparisons */}
          {comparisons && comparisons.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5 block">Benzer Emsal İlanlar</h4>
              <div className="space-y-2">
                {comparisons.slice(0, 3).map((comp, idx) => (
                  <motion.div
                    key={comp.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-card/40 border border-white/[0.04] hover:bg-surface-card/70 hover:border-white/[0.08] transition-all duration-300 group/comp"
                  >
                  <div className="min-w-0 mr-3">
                    <p className="text-xs font-bold text-white truncate group-hover/comp:text-primary-light transition-colors">{comp.title}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{comp.year} model • {formatNumber(comp.mileage)} km</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-white">{formatPrice(comp.price)}</p>
                    <p className="text-[8px] font-bold text-primary-light uppercase mt-0.5">%{Math.round(comp.similarityScore * 100)} Benzerlik</p>
                  </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
