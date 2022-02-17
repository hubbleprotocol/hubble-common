import { BORROWING_IDL } from '../dist';

describe('IDL Tests', () => {
  test('should return Hubble borrowing IDL ', () => {
    expect(BORROWING_IDL).not.toBeNull();
    expect(BORROWING_IDL.name).toBe('borrowing');
    expect(BORROWING_IDL.errors.length).toBeGreaterThan(0);
    expect(BORROWING_IDL.accounts.length).toBeGreaterThan(0);
    expect(BORROWING_IDL.types.length).toBeGreaterThan(0);
    expect(BORROWING_IDL.instructions.length).toBeGreaterThan(0);
  });
});
