import { prisma } from '../prisma.js';
import { ListingFilterQuery } from '../types/index.js';
import { Prisma } from '@prisma/client';

export class ListingService {
  async getAll(filters: ListingFilterQuery) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '12', 10);
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
      status: (filters.status as string) || 'ACTIVE',
    };

    // Metin arama
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { brand: { contains: filters.search } },
        { model: { contains: filters.search } },
      ];
    }

    // Filtreler
    if (filters.brand) where.brand = { equals: filters.brand };
    if (filters.model) where.model = { contains: filters.model };
    if (filters.city) where.city = { equals: filters.city };
    if (filters.fuelType) where.fuelType = filters.fuelType as any;
    if (filters.transmission) where.transmission = filters.transmission as any;
    if (filters.bodyType) where.bodyType = filters.bodyType as any;
    if (filters.condition) where.condition = filters.condition as any;

    // Aralık filtreleri
    if (filters.yearMin || filters.yearMax) {
      where.year = {};
      if (filters.yearMin) where.year.gte = parseInt(filters.yearMin, 10);
      if (filters.yearMax) where.year.lte = parseInt(filters.yearMax, 10);
    }

    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price.gte = parseFloat(filters.priceMin);
      if (filters.priceMax) where.price.lte = parseFloat(filters.priceMax);
    }

    if (filters.mileageMin || filters.mileageMax) {
      where.mileage = {};
      if (filters.mileageMin) where.mileage.gte = parseInt(filters.mileageMin, 10);
      if (filters.mileageMax) where.mileage.lte = parseInt(filters.mileageMax, 10);
    }

    // Sıralama
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    const orderBy: Prisma.ListingOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
          _count: { select: { favorites: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, phone: true, avatarUrl: true, createdAt: true } },
        _count: { select: { favorites: true } },
      },
    });

    if (!listing) {
      throw new Error('İlan bulunamadı');
    }

    // Görüntülenme sayısını artır
    await prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async create(userId: string, data: Prisma.ListingCreateInput & { userId?: string }) {
    const { userId: _, ...listingData } = data;
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return listing;
  }

  async update(id: string, userId: string, userRole: string, data: Prisma.ListingUpdateInput) {
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new Error('İlan bulunamadı');
    }

    if (listing.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Bu ilanı düzenleme yetkiniz yok');
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return updated;
  }

  async delete(id: string, userId: string, userRole: string) {
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new Error('İlan bulunamadı');
    }

    if (listing.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Bu ilanı silme yetkiniz yok');
    }

    await prisma.listing.delete({ where: { id } });
    return { message: 'İlan başarıyla silindi' };
  }

  async getMyListings(userId: string, page: number = 1, limit: number = 12) {
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: { userId },
        include: {
          _count: { select: { favorites: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where: { userId } }),
    ]);

    return {
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async toggleFavorite(userId: string, listingId: string) {
    const existing = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    } else {
      await prisma.favorite.create({ data: { userId, listingId } });
      return { favorited: true };
    }
  }

  async getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.listing);
  }

  async getBrands() {
    const brands = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return brands.map((b) => b.brand);
  }

  async getCities() {
    const cities = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    return cities.map((c) => c.city);
  }
}

export const listingService = new ListingService();
