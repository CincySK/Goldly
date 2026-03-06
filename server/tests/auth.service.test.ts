import { describe, expect, it } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../src/utils/jwt';

describe('auth token helpers', () => {
  it('signs and verifies access token', () => {
    const token = signAccessToken({ userId: 'u1', role: 'USER' });
    const payload = verifyAccessToken(token);
    expect(payload.userId).toBe('u1');
    expect(payload.role).toBe('USER');
  });
});
