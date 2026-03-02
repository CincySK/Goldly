import { ListingStatus, MetalType } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { SpotPriceService } from './spotPrice.service';

export class ListingService {
  constructor(private spotPriceService: SpotPriceService) {}

  async createListing(userId: string, payload: any, photoUrls: string[], certificateUrl?: string) {
    if (!photoUrls.length) throw new Error('At least one photo is required');
    const spot = await this.spotPriceService.getCurrentSpotPrices();
    const spotPrice = payload.metalType === MetalType.GOLD ? spot.gold : spot.silver;

    return prisma.listing.create({
      data: {
        sellerId: userId,
        ...payload,
        status: ListingStatus.PENDING,
        spotPriceAtListing: spotPrice,
        certificateUrl,
        photos: { create: photoUrls.map((url) => ({ url })) }
      },
      include: { photos: true }
    });
  }
}
