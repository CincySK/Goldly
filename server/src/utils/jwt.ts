import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JwtPayload = { userId: string; role: 'USER' | 'ADMIN' };

export const signAccessToken = (payload: JwtPayload) => jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
export const signRefreshToken = (payload: JwtPayload) => jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.refreshTokenTtl });
export const verifyAccessToken = (token: string) => jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
export const verifyRefreshToken = (token: string) => jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
