import { Router } from 'express';
import { reviewSchema } from '@goldly/shared';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prisma } from '../utils/prisma';

const router = Router();

router.post('/', requireAuth, validate(reviewSchema), async (req: AuthRequest, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.body.listingId } });
  if (!listing || listing.status !== 'SOLD') return res.status(400).json({ message: 'Listing must be sold first' });
  const revieweeId = listing.sellerId === req.user!.userId ? '' : listing.sellerId;
  if (!revieweeId) return res.status(400).json({ message: 'Seller cannot self-review in MVP simplification' });
  const created = await prisma.review.create({ data: { ...req.body, reviewerId: req.user!.userId, revieweeId } });
  res.json(created);
});

export default router;
