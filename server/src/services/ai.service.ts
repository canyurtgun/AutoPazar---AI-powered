import { prisma } from '../prisma.js';
import { AIPredictionRequest, AIPredictionResponse } from '../types/index.js';

export class AIService {
  /**
   * Benzerlik skoru hesapla (0-1 arası)
   */
  private calculateSimilarityScore(
    listing: { brand: string; model: string; year: number; mileage: number; fuelType: string; transmission: string; bodyType: string; city: string },
    query: AIPredictionRequest
  ): number {
    let score = 0;

    // Marka eşleşmesi (30 puan)
    if (listing.brand.toLowerCase() === query.brand.toLowerCase()) score += 30;

    // Model eşleşmesi (25 puan)
    if (listing.model.toLowerCase().includes(query.model.toLowerCase()) ||
        query.model.toLowerCase().includes(listing.model.toLowerCase())) {
      score += 25;
    }

    // Yıl yakınlığı (max 20 puan)
    const yearDiff = Math.abs(listing.year - query.year);
    score += Math.max(0, 20 - yearDiff * 5);

    // Kilometre yakınlığı (max 15 puan)
    const mileageDiff = Math.abs(listing.mileage - query.mileage);
    score += Math.max(0, 15 - (mileageDiff / 10000) * 3);

    // Yakıt tipi eşleşmesi (5 puan)
    if (query.fuelType && listing.fuelType === query.fuelType) score += 5;

    // Vites tipi eşleşmesi (5 puan)
    if (query.transmission && listing.transmission === query.transmission) score += 5;

    return Math.min(score / 100, 1);
  }

  /**
   * Ortalama fiyat tahmini yap
   */
  async predict(query: AIPredictionRequest, userPrice?: number): Promise<AIPredictionResponse> {
    // Aynı marka ilanlarını çek
    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        brand: query.brand,
      },
      select: {
        id: true,
        title: true,
        price: true,
        brand: true,
        model: true,
        year: true,
        mileage: true,
        fuelType: true,
        transmission: true,
        bodyType: true,
        city: true,
        createdAt: true,
      },
    });

    // Benzerlik skorlarını hesapla
    const scoredListings = listings
      .map((listing) => ({
        ...listing,
        similarityScore: this.calculateSimilarityScore(listing, query),
      }))
      .filter((l) => l.similarityScore >= 0.3) // En az %30 benzerlik
      .sort((a, b) => b.similarityScore - a.similarityScore);

    const sampleCount = scoredListings.length;

    if (sampleCount === 0) {
      // Yeterli veri yoksa geniş kapsamlı tahmin
      const allBrandListings = await prisma.listing.findMany({
        where: {
          status: 'ACTIVE',
          brand: query.brand,
        },
        select: { price: true },
      });

      if (allBrandListings.length === 0) {
        return {
          prediction: {
            averagePrice: 0,
            medianPrice: 0,
            minPrice: 0,
            maxPrice: 0,
            confidenceScore: 0,
            confidenceLevel: 'VERİ YOK',
            standardDeviation: 0,
            sampleCount: 0,
            trend: { direction: 'STABLE', changePercent: 0, period: '30_DAYS' },
          },
          comparisons: [],
        };
      }

      const prices = allBrandListings.map((l) => l.price).sort((a, b) => a - b);
      return {
        prediction: {
          averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
          medianPrice: Math.round(prices[Math.floor(prices.length / 2)]),
          minPrice: Math.round(prices[0]),
          maxPrice: Math.round(prices[prices.length - 1]),
          confidenceScore: 0.2,
          confidenceLevel: 'DÜŞÜK',
          standardDeviation: Math.round(this.standardDeviation(prices)),
          sampleCount: prices.length,
          trend: { direction: 'STABLE', changePercent: 0, period: '30_DAYS' },
        },
        comparisons: [],
      };
    }

    // Ağırlıklı ortalama hesapla
    const totalWeight = scoredListings.reduce((sum, l) => sum + l.similarityScore, 0);
    const weightedAverage = scoredListings.reduce(
      (sum, l) => sum + l.price * l.similarityScore,
      0
    ) / totalWeight;

    const prices = scoredListings.map((l) => l.price).sort((a, b) => a - b);

    // Medyan
    const medianIndex = Math.floor(prices.length / 2);
    const medianPrice = prices.length % 2 === 0
      ? (prices[medianIndex - 1] + prices[medianIndex]) / 2
      : prices[medianIndex];

    // Standart sapma
    const stdDev = this.standardDeviation(prices);

    // %95 güven aralığı
    const minPrice = Math.round(weightedAverage - 1.96 * stdDev);
    const maxPrice = Math.round(weightedAverage + 1.96 * stdDev);

    // Güvenilirlik skoru
    let confidenceScore: number;
    let confidenceLevel: string;

    if (sampleCount >= 15) {
      confidenceScore = Math.min(0.95, 0.7 + (sampleCount / 100));
      confidenceLevel = 'YÜKSEK';
    } else if (sampleCount >= 5) {
      confidenceScore = 0.5 + (sampleCount / 30);
      confidenceLevel = 'ORTA';
    } else {
      confidenceScore = 0.2 + (sampleCount / 15);
      confidenceLevel = 'DÜŞÜK';
    }

    // En benzer ilanların ortalama benzerlik skoru ile güvenilirliği ayarla
    const avgSimilarity = scoredListings.slice(0, 5).reduce((sum, l) => sum + l.similarityScore, 0) / Math.min(5, sampleCount);
    confidenceScore = Math.min(confidenceScore * (0.5 + avgSimilarity * 0.5), 0.98);

    // Piyasa trendi (son 30 gün vs öncesi)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentListings = scoredListings.filter((l) => l.createdAt >= thirtyDaysAgo);
    const olderListings = scoredListings.filter((l) => l.createdAt >= sixtyDaysAgo && l.createdAt < thirtyDaysAgo);

    let trendDirection: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    let trendChangePercent = 0;

    if (recentListings.length > 0 && olderListings.length > 0) {
      const recentAvg = recentListings.reduce((sum, l) => sum + l.price, 0) / recentListings.length;
      const olderAvg = olderListings.reduce((sum, l) => sum + l.price, 0) / olderListings.length;
      trendChangePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

      if (trendChangePercent > 2) trendDirection = 'UP';
      else if (trendChangePercent < -2) trendDirection = 'DOWN';
    }

    // Kullanıcı fiyatı değerlendirmesi
    let priceAssessment: string | undefined;
    if (userPrice) {
      const ratio = userPrice / weightedAverage;
      if (ratio < 0.85) priceAssessment = 'PİYASA ALTINDA';
      else if (ratio > 1.15) priceAssessment = 'PİYASA ÜSTÜNDE';
      else priceAssessment = 'UYGUN FİYAT';
    }

    // En benzer 5 ilan
    const comparisons = scoredListings.slice(0, 5).map((l) => ({
      id: l.id,
      title: l.title,
      price: l.price,
      year: l.year,
      mileage: l.mileage,
      similarityScore: Math.round(l.similarityScore * 100) / 100,
    }));

    return {
      prediction: {
        averagePrice: Math.round(weightedAverage),
        medianPrice: Math.round(medianPrice),
        minPrice: Math.max(0, minPrice),
        maxPrice: maxPrice,
        confidenceScore: Math.round(confidenceScore * 100) / 100,
        confidenceLevel,
        standardDeviation: Math.round(stdDev),
        sampleCount,
        trend: {
          direction: trendDirection,
          changePercent: Math.round(trendChangePercent * 10) / 10,
          period: '30_DAYS',
        },
      },
      comparisons,
      userPrice,
      priceAssessment,
    };
  }

  /**
   * Genel piyasa istatistikleri
   */
  async getMarketStats() {
    const [totalListings, avgPrice, brandStats] = await Promise.all([
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.aggregate({
        where: { status: 'ACTIVE' },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
      }),
      prisma.listing.groupBy({
        by: ['brand'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
        _avg: { price: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    return {
      totalListings,
      averagePrice: Math.round(avgPrice._avg.price || 0),
      minPrice: Math.round(avgPrice._min.price || 0),
      maxPrice: Math.round(avgPrice._max.price || 0),
      topBrands: brandStats.map((b) => ({
        brand: b.brand,
        count: b._count.id,
        avgPrice: Math.round(b._avg.price || 0),
      })),
    };
  }

  /**
   * Standart sapma hesapla
   */
  private standardDeviation(values: number[]): number {
    if (values.length <= 1) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / (values.length - 1);
    return Math.sqrt(avgSquareDiff);
  }
}

export const aiService = new AIService();
