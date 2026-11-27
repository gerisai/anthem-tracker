import { describe, expect, it } from 'vitest';
import { groupByMonth, recentDates, RECENT_WINDOW_MS } from '@/lib/Utils';

// UTC-6: a date stored as UTC midnight is the previous day in local time, which
// is what used to put December 1 under "Noviembre"
process.env.TZ = 'America/Mexico_City';

const service = (id: string, date: string) => ({ id, date: new Date(`${date}T00:00:00.000Z`) });

describe('groupByMonth', () => {
  it('separates the same month in different years, oldest first', () => {
    const groups = groupByMonth([
      service('b', '2026-11-08'),
      service('a', '2025-11-02'),
      service('c', '2026-11-01'),
    ]);

    expect(groups.map((g) => g.label)).toEqual(['Noviembre 2025', 'Noviembre 2026']);
    expect(groups[1].programs.map((p) => p.id)).toEqual(['c', 'b']);
  });

  it('groups by the stored UTC date, not the local time zone', () => {
    const groups = groupByMonth([service('a', '2026-12-01'), service('b', '2026-11-30')]);

    expect(groups.map((g) => [g.label, g.programs.map((p) => p.id)])).toEqual([
      ['Noviembre 2026', ['b']],
      ['Diciembre 2026', ['a']],
    ]);
  });

  it('does not reorder the array it is given', () => {
    const programs = [service('b', '2026-11-08'), service('a', '2026-11-01')];

    groupByMonth(programs);

    expect(programs.map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('accepts dates as strings', () => {
    expect(groupByMonth([{ id: 'a', date: '2026-01-04T00:00:00.000Z' }])[0].label).toBe('Enero 2026');
  });
});

describe('recentDates', () => {
  const now = Date.UTC(2026, 10, 30);

  it('keeps only dates within the last 30 days', () => {
    const inside = new Date(now - RECENT_WINDOW_MS + 1);
    const edge = new Date(now - RECENT_WINDOW_MS);
    const old = new Date(now - RECENT_WINDOW_MS - 1);

    expect(recentDates([old, edge, inside], now)).toEqual([inside]);
  });
});
