import { formatRouteDistance, formatRouteDuration } from '~/utils/formatRoute';

describe('formatRouteDuration', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatRouteDuration(undefined)).toBe('');
    expect(formatRouteDuration(null as unknown as undefined)).toBe('');
  });

  it('formats seconds as rounded minutes', () => {
    expect(formatRouteDuration(90)).toBe('2 min');
    expect(formatRouteDuration(60)).toBe('1 min');
  });
});

describe('formatRouteDistance', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatRouteDistance(undefined)).toBe('');
    expect(formatRouteDistance(null as unknown as undefined)).toBe('');
  });

  it('formats meters as kilometers with one decimal', () => {
    expect(formatRouteDistance(1500)).toBe('1.5 km');
    expect(formatRouteDistance(500)).toBe('0.5 km');
  });
});
