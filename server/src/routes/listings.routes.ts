import { Router } from 'express';
import multer from 'multer';
import { createListingSchema } from '@goldly/shared';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { ListingService } from '../services/listing.service';
import { SpotPriceService, StaticSpotPriceProvider } from '../services/spotPrice.service';
import { prisma } from '../utils/prisma';

const upload = multer({ dest: 'uploads/', limits: { fileSize: 8 * 1024 * 1024 } });
const router = Router();
const listingService = new ListingService(new SpotPriceService(new StaticSpotPriceProvider()));

router.post('/', requireAuth, upload.fields([{ name: 'photos' }, { name: 'certificate' }]), validate(createListingSchema), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;
    const photos = files?.photos?.map((f) => f.path) ?? [];
    const cert = files?.certificate?.[0]?.path;
    const listing = await listingService.createListing(req.user!.userId, req.body, photos, cert);
    res.json(listing);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  const { search, mint, metalType, minWeight, maxWeight, minPrice, maxPrice, sort } = req.query;
  const listings = await prisma.listing.findMany({
    where: {
      status: 'APPROVED',
      title: search ? { contains: String(search), mode: 'insensitive' } : undefined,
      mint: mint ? { equals: String(mint), mode: 'insensitive' } : undefined,
      metalType: metalType ? String(metalType) as any : undefined,
      weight: { gte: minWeight ? Number(minWeight) : undefined, lte: maxWeight ? Number(maxWeight) : undefined },
      askingPrice: { gte: minPrice ? Number(minPrice) : undefined, lte: maxPrice ? Number(maxPrice) : undefined }
    },
    include: { seller: true, photos: true },
    orderBy: sort === 'price_asc' ? { askingPrice: 'asc' } : sort === 'price_desc' ? { askingPrice: 'desc' } : { createdAt: 'desc' }
  });
  res.json(listings);
});

router.get('/:id', async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id }, include: { seller: true, photos: true } });
  if (!listing) return res.status(404).json({ message: 'Not found' });
  const spot = await new SpotPriceService(new StaticSpotPriceProvider()).getCurrentSpotPrices();
  res.json({ ...listing, liveSpotPrice: listing.metalType === 'GOLD' ? spot.gold : spot.silver });
});

router.patch('/:id/mark-sold', requireAuth, async (req: AuthRequest, res) => {
  const current = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!current || current.sellerId !== req.user!.userId) return res.status(404).json({ message: 'Listing not found' });
  const listing = await prisma.listing.update({ where: { id: req.params.id }, data: { status: 'SOLD' } });
  res.json(listing);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const current = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!current || current.sellerId !== req.user!.userId) return res.status(404).json({ message: 'Listing not found' });
  await prisma.listing.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
