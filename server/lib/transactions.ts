import { get, round, sumBy, uniqBy } from 'lodash-es';
import { Account, Transaction } from '../graphql/types/v2/schema.js';

/** Given a transaction, return the collective that receive the money */
export const getTransactionReceiver = (transaction: Transaction): Account => {
  return transaction.type === 'CREDIT' ? transaction.toAccount : transaction.fromAccount;
};

/**
 * Return the tax percentage applied for this transaction
 * TODO: More from percentage (10) to rate (.10)
 */
export const getTransactionTaxPercent = (transaction: {
  taxAmount?: { valueInCents?: number };
  amountInHostCurrency?: { valueInCents?: number };
  order?: { taxPercentage?: number; data?: { tax: { percentage: number } } };
  hostCurrencyFxRate?: number;
  taxInfo?: { rate: number };
}): number => {
  const taxAmount = Math.abs(transaction.taxAmount?.valueInCents);
  if (!taxAmount) {
    return 0;
  }

  if (transaction.taxInfo) {
    return round(transaction.taxInfo.rate * 100, 2);
  } else if (transaction.order?.data?.tax) {
    const percent = get(transaction, 'order.data.tax.percentage');
    const percentV2 = get(transaction, 'order.taxPercentage');
    if (percent || percentV2) {
      return percent || percentV2;
    }
  }

  // Calculate from amount
  return round((taxAmount / (transaction.amountInHostCurrency.valueInCents - taxAmount)) * 100, 2);
};

export const getTaxInfoFromTransaction = (
  transaction: Parameters<typeof getTransactionTaxPercent>[0] & {
    taxInfo?: { idNumber?: string; rate: number; type: string; id?: string };
    order?: { data?: Record<string, unknown> };
  },
): {
  type: string;
  rate: number;
  idNumber: string;
} => {
  if (transaction.taxInfo) {
    return {
      ...transaction.taxInfo,
      rate: transaction.taxInfo.rate || round(getTransactionTaxPercent(transaction) / 100, 4),
      type: transaction.taxInfo.type || transaction.taxInfo.id || 'Tax',
      idNumber: transaction.taxInfo.idNumber || transaction.taxInfo.id || 'Tax',
    };
  } else if (transaction.order?.data?.tax) {
    return {
      type: (get(transaction.order.data, 'tax.id') as string) || 'Tax',
      rate:
        (get(transaction.order.data, 'tax.rate') as number) || round(getTransactionTaxPercent(transaction) / 100, 4),
      idNumber: (get(transaction.order.data, 'tax.taxIDNumber') as string) || 'Tax',
    };
  }
};

export const getTaxIdNumbersFromTransactions = (
  transactions: Array<Parameters<typeof getTaxInfoFromTransaction>[0]>,
): Array<{ type: string; idNumber: string }> => {
  const taxesSummary = transactions.map(getTaxInfoFromTransaction).filter(t => t?.idNumber);
  const uniqTaxInfo = uniqBy(taxesSummary, s => `${s.type}-${s.idNumber}`);
  return uniqTaxInfo;
};

/**
 * Get a list of taxes
 * @returns {Array} like [{ key: 'VAT-21', id: 'VAT', percentage: 21, amount: 42 }]
 */
export const getTaxesBreakdown = (transactions: Array<Transaction>) => {
  const groupedTransactions: Record<
    string,
    { info: ReturnType<typeof getTaxInfoFromTransaction>; transactions: Array<Transaction> }
  > = {};
  for (const transaction of transactions) {
    const taxInfo = getTaxInfoFromTransaction(transaction);
    if (taxInfo) {
      const taxId = `${taxInfo.type}-${taxInfo.rate}`;
      groupedTransactions[taxId] = groupedTransactions[taxId] || { info: taxInfo, transactions: [] };
      groupedTransactions[taxId].transactions.push(transaction);
    }
  }

  return Object.entries(groupedTransactions).map(([id, taxBreakdown]) => ({
    id,
    info: taxBreakdown.info,
    amount: Math.abs(sumBy(taxBreakdown.transactions, t => t.taxAmount?.valueInCents)),
    amountInHostCurrency: Math.round(
      Math.abs(sumBy(taxBreakdown.transactions, t => t.taxAmount?.valueInCents * (t.hostCurrencyFxRate || 1))),
    ),
  }));
};

export const getTransactionUrl = (transaction: Transaction) => {
  const domain = 'https://opencollective.com'; // We should have this one change based on env
  const toAccount = transaction.toAccount;
  if (transaction.order?.legacyId) {
    return `${domain}/${toAccount.slug}/contributions/${transaction.order.legacyId}`;
  } else {
    return `${domain}/${toAccount.slug}/transactions`;
  }
};
