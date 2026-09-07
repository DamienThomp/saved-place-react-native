import isEmptyString from '~/utils/isEmptyString';

describe('isEmptyString', () => {
  it('returns true for empty string', () => {
    expect(isEmptyString('')).toBe(true);
  });

  it('returns true for whitespace-only string', () => {
    expect(isEmptyString('   ')).toBe(true);
  });

  it('returns false for non-empty string', () => {
    expect(isEmptyString('hello')).toBe(false);
  });
});
