import { prisma } from '../prisma.js';

export class AdminService {
  async getDashboard() {
    const [
      totalUsers,
      totalListings,
      activeListings,
      soldListings,
      pendingListings,
      avgPrice,
      recentListings,
      topBrands,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count({ where: { status: 'SOLD' } }),
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.listing.aggregate({
        where: { status: 'ACTIVE' },
        _avg: { price: true },
      }),
      prisma.listing.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { fullName: true } },
        },
      }),
      prisma.listing.groupBy({
        by: ['brand'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        soldListings,
        pendingListings,
        averagePrice: Math.round(avgPrice._avg.price || 0),
      },
      recentListings,
      topBrands: topBrands.map((b) => ({ brand: b.brand, count: b._count.id })),
    };
  }

  async getAllListings(page: number = 1, limit: number = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as string } : {};

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateListingStatus(id: string, status: string) {
    return prisma.listing.update({
      where: { id },
      data: { status },
    });
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { listings: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, fullName: true, isActive: true },
    });
  }
}

export const adminService = new AdminService();
