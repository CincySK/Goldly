import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const notifications = await prisma.notification.findMany({ where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' } });
  res.json(notifications);
});

export default router;
