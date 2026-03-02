import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  async signup(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('Email already exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    return this.issueTokens(user.id, user.role);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new Error('Invalid credentials');
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    return this.issueTokens(payload.userId, payload.role);
  }

  private async issueTokens(userId: string, role: 'USER' | 'ADMIN') {
    const accessToken = signAccessToken({ userId, role });
    const refreshToken = signRefreshToken({ userId, role });
    await prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 7 * 86400000) } });
    return { accessToken, refreshToken };
  }
}
