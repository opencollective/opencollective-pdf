import { getTransactionTaxPercent } from '../../lib/transactions';

describe('lib/transactions', () => {
  describe('getTransactionTaxPercent', () => {
    it('returns 0 for untaxed transactions', () => {
      expect(getTransactionTaxPercent({ taxAmount: null })).toBe(0);
      expect(getTransactionTaxPercent({ taxAmount: 0 })).toBe(0);
    });
  });
});
