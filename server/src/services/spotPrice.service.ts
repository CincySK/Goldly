export interface SpotPriceProvider {
  getSpotPrices(): Promise<{ gold: number; silver: number }>;
}

export class StaticSpotPriceProvider implements SpotPriceProvider {
  async getSpotPrices(): Promise<{ gold: number; silver: number }> {
    return { gold: 2300, silver: 28 };
  }
}

export class SpotPriceService {
  private cache?: { data: { gold: number; silver: number }; expiresAt: number };

  constructor(private provider: SpotPriceProvider) {}

  async getCurrentSpotPrices() {
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) return this.cache.data;
    const data = await this.provider.getSpotPrices();
    this.cache = { data, expiresAt: now + 60000 };
    return data;
  }
}
