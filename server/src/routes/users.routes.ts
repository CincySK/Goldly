import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { reviewsReceived: true }
  });
  if (!user) return res.status(404).json({ message: 'Not found' });
  const count = user.reviewsReceived.length;
  const avgRating = count ? user.reviewsReceived.reduce((a, r) => a + r.rating, 0) / count : 0;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    verificationStatus: user.verificationStatus,
    ratingSummary: { avgRating, count }
  });
});

router.patch('/me', requireAuth, validate(z.object({ name: z.string().min(2) })), async (req: AuthRequest, res) => {
  const updated = await prisma.user.update({ where: { id: req.user!.userId }, data: { name: req.body.name } });
  res.json({ id: updated.id, name: updated.name, email: updated.email });
});

export default router;
