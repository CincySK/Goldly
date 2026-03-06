import { Router } from 'express';
import multer from 'multer';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';

const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

router.post('/submit', requireAuth, upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'selfie' }]), async (req: AuthRequest, res) => {
  const files = req.files as Record<string, Express.Multer.File[]>;
  if (!files?.idFront?.[0] || !files?.idBack?.[0] || !files?.selfie?.[0]) return res.status(400).json({ message: 'Missing required files' });
  const data = await prisma.kYCSubmission.create({
    data: {
      userId: req.user!.userId,
      idFrontUrl: files.idFront[0].path,
      idBackUrl: files.idBack[0].path,
      selfieUrl: files.selfie[0].path,
      status: 'PENDING'
    }
  });
  await prisma.user.update({ where: { id: req.user!.userId }, data: { verificationStatus: 'PENDING' } });
  res.json(data);
});

router.get('/status', requireAuth, async (req: AuthRequest, res) => {
  const latest = await prisma.kYCSubmission.findFirst({ where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' } });
  res.json(latest ?? { status: 'UNVERIFIED' });
});

export default router;
