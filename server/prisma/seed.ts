import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@goldly.local' },
    update: {},
    create: { name: 'Admin', email: 'admin@goldly.local', passwordHash: adminHash, role: 'ADMIN', verificationStatus: 'VERIFIED' }
  });

  const userHash = await bcrypt.hash('User12345!', 10);
  await prisma.user.upsert({
    where: { email: 'user@goldly.local' },
    update: {},
    create: { name: 'Sample User', email: 'user@goldly.local', passwordHash: userHash, role: 'USER' }
  });
}

main().finally(() => prisma.$disconnect());
