import getIdFromParam from '~/utils/getIdFromParam';

describe('getIdFromParam', () => {
  it('returns undefined when param is missing', () => {
    expect(getIdFromParam(undefined)).toBeUndefined();
  });

  it('parses string param to number', () => {
    expect(getIdFromParam('42')).toBe(42);
  });

  it('parses first element when param is an array', () => {
    expect(getIdFromParam(['7', '8'])).toBe(7);
  });
});
