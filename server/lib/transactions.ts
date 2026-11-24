import { get, isUndefined, round, sumBy, uniqBy } from 'lodash-es';
import { Account, Transaction } from '../graphql/types/v2/graphql.js';

/** Given a transaction, return the collective that receive the money */
export const getTransactionReceiver = (transaction: Transaction): Account | null | undefined => {
  return transaction.type === 'CREDIT' ? transaction.toAccount : transaction.fromAccount;
};

/**
 * Return the tax percentage applied for this transaction
 */
export const getTransactionTaxPercent = (transaction: {
  taxAmount?: { valueInCents?: number | null } | null;
  amountInHostCurrency?: { valueInCents?: number | null } | null;
  order?: { taxPercentage?: number | null; data?: { tax: { percentage: number } } } | null;
  hostCurrencyFxRate?: number;
  taxInfo?: { rate: number; percentage: number };
}): number => {
  if (transaction.taxInfo) {
    if (transaction.taxInfo.percentage) {
      return transaction.taxInfo.percentage;
    } else {
      return round(transaction.taxInfo.rate * 100, 2);
    }
  } else if (transaction.order?.data?.tax) {
    const percent = get(transaction, 'order.data.tax.percentage');
    const percentV2 = get(transaction, 'order.taxPercentage');
    const orderTaxPercent = percent || percentV2;
    if (orderTaxPercent) {
      return orderTaxPercent;
    }
  }

  const taxAmountInCents = transaction.taxAmount?.valueInCents;
  if (!taxAmountInCents) {
    return 0;
  }
  const taxAmount = Math.abs(taxAmountInCents);

  // Calculate from amount
  if (!transaction.amountInHostCurrency) {
    // This used to fail on a TypeError. A transaction with a tax always has an amount.
    throw new Error('Cannot calculate the tax percentage of a transaction without amountInHostCurrency');
  }
  return round((taxAmount / (Number(transaction.amountInHostCurrency.valueInCents) - taxAmount)) * 100, 2);
};

const getTaxPercentageFromOrderData = (data: unknown) => {
  const percentage = get(data, 'tax.percentage') as number | undefined;
  if (!isUndefined(percentage)) {
    return percentage;
  }

  const rate = get(data, 'tax.rate') as number | undefined;
  if (!isUndefined(rate)) {
    return round(rate * 100, 2);
  }

  return undefined;
};

export const getTaxInfoFromTransaction = (
  transaction: Parameters<typeof getTransactionTaxPercent>[0] & {
    taxInfo?: { idNumber?: string; rate: number; type: string; id?: string };
    order?: { tax?: { id: string; idNumber: string; percentage: number; rate: number } } | null;
  },
):
  | {
      type: string;
      rate: number | undefined;
      idNumber: string;
    }
  | undefined => {
  if (transaction.taxInfo) {
    return {
      ...transaction.taxInfo,
      rate: transaction.taxInfo.rate || round(getTransactionTaxPercent(transaction) / 100, 4),
      type: transaction.taxInfo.type || transaction.taxInfo.id || 'Tax',
      idNumber: transaction.taxInfo.idNumber || transaction.taxInfo.id || 'Tax',
    };
  } else if (transaction.order?.tax) {
    const percentage = getTransactionTaxPercent(transaction) ?? getTaxPercentageFromOrderData(transaction.order.data);
    return {
      type: (get(transaction.order, 'tax.id') as string) || 'Tax',
      rate: percentage ? round(percentage / 100, 4) : undefined,
      idNumber: (get(transaction.order, 'tax.idNumber') as string) || 'Tax',
    };
  }

  return undefined;
};

export const getTaxIdNumbersFromTransactions = (
  transactions: Array<Parameters<typeof getTaxInfoFromTransaction>[0]>,
): Array<{ type: string; idNumber: string }> => {
  const taxesSummary = transactions
    .map(getTaxInfoFromTransaction)
    .filter((t): t is NonNullable<typeof t> => Boolean(t?.idNumber));
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
    { info: NonNullable<ReturnType<typeof getTaxInfoFromTransaction>>; transactions: Array<Transaction> }
  > = {};
  for (const transaction of transactions) {
    const taxInfo = getTaxInfoFromTransaction(transaction as any);
    if (taxInfo) {
      const taxId = `${taxInfo.type}-${taxInfo.rate}`;
      groupedTransactions[taxId] = groupedTransactions[taxId] || { info: taxInfo, transactions: [] };
      groupedTransactions[taxId].transactions.push(transaction);
    }
  }

  return Object.entries(groupedTransactions).map(([id, taxBreakdown]) => ({
    id,
    info: taxBreakdown.info,
    amount: Math.abs(sumBy(taxBreakdown.transactions, 'taxAmount.valueInCents')),
    amountInHostCurrency: Math.round(
      Math.abs(sumBy(taxBreakdown.transactions, t => Number(t.taxAmount?.valueInCents) * (t.hostCurrencyFxRate || 1))),
    ),
  }));
};

export const getTransactionUrl = (transaction: Transaction) => {
  const domain = 'https://opencollective.com'; // We should have this one change based on env
  const toAccount = transaction.toAccount;
  if (!toAccount) {
    // Both branches below read `toAccount.slug`, so this would have thrown a TypeError anyway
    throw new Error(`Transaction ${transaction.id} has no toAccount`);
  }
  if (transaction.order?.legacyId) {
    return `${domain}/${toAccount.slug}/contributions/${transaction.order.legacyId}`;
  } else {
    return `${domain}/${toAccount.slug}/transactions`;
  }
};
