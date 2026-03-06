import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { MessagingService } from '../services/messaging.service';
import { prisma } from '../utils/prisma';

const router = Router();
const messagingService = new MessagingService();

router.post('/start', requireAuth, validate(z.object({ listingId: z.string().uuid(), sellerId: z.string().uuid() })), async (req: AuthRequest, res) => {
  const convo = await messagingService.startConversation(req.body.listingId, req.user!.userId, req.body.sellerId);
  res.json(convo);
});

router.get('/conversations/:id/messages', requireAuth, async (req, res) => {
  const messages = await prisma.chatMessage.findMany({ where: { conversationId: req.params.id }, orderBy: { createdAt: 'asc' } });
  res.json(messages);
});

router.post('/report', requireAuth, validate(z.object({ type: z.enum(['USER', 'LISTING', 'CHAT']), reason: z.string().min(2), targetUserId: z.string().optional(), targetListingId: z.string().optional(), targetChatId: z.string().optional() })), async (req: AuthRequest, res) => {
  const report = await prisma.report.create({ data: { reporterId: req.user!.userId, ...req.body } });
  res.json(report);
});

export default router;
