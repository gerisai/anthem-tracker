import { describe, expect, it } from 'vitest';
import { recentDates, RECENT_WINDOW_MS } from '@/lib/Utils';

describe('recentDates', () => {
  const now = Date.UTC(2026, 10, 30);

  it('keeps only dates within the last 30 days', () => {
    const inside = new Date(now - RECENT_WINDOW_MS + 1);
    const edge = new Date(now - RECENT_WINDOW_MS);
    const old = new Date(now - RECENT_WINDOW_MS - 1);

    expect(recentDates([old, edge, inside], now)).toEqual([inside]);
  });
});
