import { getAddress } from '~/api/geocode';

describe('getAddress', () => {
  it('returns full address from geocode response', async () => {
    const address = await getAddress([-74.006, 40.7128]);

    expect(address).toBe('123 Main St, New York, NY 10001');
  });

  it('returns n/a when no features are found', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ features: [] }),
    });

    const address = await getAddress([-74.006, 40.7128]);

    expect(address).toBe('n/a');
    global.fetch = originalFetch;
  });

  it('throws on HTTP error', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getAddress([-74.006, 40.7128])).rejects.toThrow(
      'Failed to fetch address (500)'
    );

    global.fetch = originalFetch;
  });
});
