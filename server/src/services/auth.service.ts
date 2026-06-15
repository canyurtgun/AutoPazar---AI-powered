import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.js';
import { config } from '../config/index.js';
import { AuthPayload } from '../types/index.js';

export class AuthService {
  async register(email: string, password: string, fullName: string, phone?: string) {
    // E-posta kontrolü
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Bu e-posta adresi zaten kayıtlı');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, phone },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('E-posta veya şifre hatalı');
    }

    if (!user.isActive) {
      throw new Error('Hesabınız devre dışı bırakılmış');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('E-posta veya şifre hatalı');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        _count: { select: { listings: true, favorites: true } },
      },
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return user;
  }

  async updateProfile(userId: string, data: { fullName?: string; phone?: string; avatarUrl?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  private generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role } as AuthPayload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );
  }
}

export const authService = new AuthService();
