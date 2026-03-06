import { Router } from 'express';
import { reviewSchema } from '@goldly/shared';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prisma } from '../utils/prisma';

const router = Router();

router.post('/', requireAuth, validate(reviewSchema), async (req: AuthRequest, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: req.body.listingId },
    include: { conversations: true }
  });

  if (!listing || listing.status !== 'SOLD') {
    return res.status(400).json({ message: 'Listing must be sold first' });
  }

  if (req.body.revieweeId === req.user!.userId) {
    return res.status(400).json({ message: 'Cannot review yourself' });
  }

  const participants = new Set<string>([listing.sellerId]);
  for (const c of listing.conversations) participants.add(c.buyerId);

  if (!participants.has(req.user!.userId) || !participants.has(req.body.revieweeId)) {
    return res.status(403).json({ message: 'Only trade participants can review each other' });
  }

  const created = await prisma.review.create({
    data: {
      listingId: req.body.listingId,
      reviewerId: req.user!.userId,
      revieweeId: req.body.revieweeId,
      rating: req.body.rating,
      text: req.body.text
    }
  });

  res.json(created);
});

export default router;
