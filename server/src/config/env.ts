import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? '7d',
  spotPriceApiUrl: process.env.SPOT_PRICE_API_URL ?? '',
  spotPriceApiKey: process.env.SPOT_PRICE_API_KEY ?? '',
  fileUploadDir: process.env.FILE_UPLOAD_DIR ?? 'uploads'
};
