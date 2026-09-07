import { DirectionType, getDirections } from '~/api/directions';

describe('getDirections', () => {
  const start = { longitude: -74.006, latitude: 40.7128 };
  const end = { longitude: -73.9855, latitude: 40.758 };

  it('returns parsed directions JSON', async () => {
    const result = await getDirections(start, end, DirectionType.Walking);

    expect(result?.code).toBe('Ok');
    expect(result?.routes[0].duration).toBe(300);
  });

  it('throws on HTTP error', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getDirections(start, end)).rejects.toThrow('Failed to fetch directions (500)');

    global.fetch = originalFetch;
  });
});
