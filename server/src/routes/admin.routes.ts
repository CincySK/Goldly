import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prisma } from '../utils/prisma';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/kyc/pending', async (_req, res) => res.json(await prisma.kYCSubmission.findMany({ where: { status: 'PENDING' } })));
router.post('/kyc/:id/review', validate(z.object({ approve: z.boolean(), reason: z.string().optional() })), async (req: AuthRequest, res) => {
  const status = req.body.approve ? 'VERIFIED' : 'REJECTED';
  const updated = await prisma.kYCSubmission.update({ where: { id: req.params.id }, data: { status, reviewReason: req.body.reason, reviewedByAdminId: req.user!.userId } });
  await prisma.user.update({ where: { id: updated.userId }, data: { verificationStatus: status } });
  res.json(updated);
});

router.get('/listings/pending', async (_req, res) => res.json(await prisma.listing.findMany({ where: { status: 'PENDING' }, include: { photos: true, seller: true } })));
router.post('/listings/:id/review', validate(z.object({ approve: z.boolean(), reason: z.string().optional() })), async (req: AuthRequest, res) => {
  const updated = await prisma.listing.update({ where: { id: req.params.id }, data: { status: req.body.approve ? 'APPROVED' : 'REJECTED', rejectionReason: req.body.reason } });
  res.json(updated);
});

router.get('/reports', async (_req, res) => res.json(await prisma.report.findMany({ orderBy: { createdAt: 'desc' } })));
router.post('/users/:id/suspend', async (req: AuthRequest, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { suspended: true } });
  await prisma.auditLog.create({ data: { actorId: req.user!.userId, action: 'USER_SUSPENDED', metadata: { userId: user.id } } });
  res.json(user);
});
router.post('/users/:id/unsuspend', async (req: AuthRequest, res) => {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { suspended: false } });
  await prisma.auditLog.create({ data: { actorId: req.user!.userId, action: 'USER_UNSUSPENDED', metadata: { userId: user.id } } });
  res.json(user);
});
router.get('/audit-logs', async (_req, res) => res.json(await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } })));

export default router;
