import { describe, expect, it } from 'vitest';
import { SpotPriceService, StaticSpotPriceProvider } from '../src/services/spotPrice.service';

describe('spot price cache', () => {
  it('returns spot prices', async () => {
    const service = new SpotPriceService(new StaticSpotPriceProvider());
    const prices = await service.getCurrentSpotPrices();
    expect(prices.gold).toBeGreaterThan(0);
    expect(prices.silver).toBeGreaterThan(0);
  });
});
