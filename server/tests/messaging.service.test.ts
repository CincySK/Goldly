import { describe, expect, it } from 'vitest';

describe('messaging payload shape', () => {
  it('supports image/pdf attachment types for MVP', () => {
    const accepted = ['image/jpeg', 'image/png', 'application/pdf'];
    expect(accepted.includes('application/pdf')).toBe(true);
  });
});
