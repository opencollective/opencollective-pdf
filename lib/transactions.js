import { get, isNil, round, sumBy, uniqBy } from 'lodash';

/** Given a transaction, return the collective that receive the money */
export const getTransactionReceiver = (transaction) => {
  return transaction.type === 'CREDIT'
    ? transaction.collective || transaction.toAccount
    : transaction.fromCollective || transaction.fromAccount;
};

/**
 * Returns an amount in cents from either GQLV1 or GQLV2
 */
export const getAmount = (amount) => {
  if (isNil(amount) || typeof amount === 'number') {
    return amount;
  } else {
    return amount.valueInCents;
  }
};

/**
 * For a transaction, return the amount paid as a positive integer
 */
export const getTransactionAmount = (transaction) => {
  return getAmount(transaction.amountInHostCurrency);
};

/**
 * Return the tax percentage applied for this transaction
 * TODO: More from percentage (10) to rate (.10)
 */
export const getTransactionTaxPercent = (transaction) => {
  const taxAmount = Math.abs(getAmount(transaction.taxAmount));
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
  const amount = getTransactionAmount(transaction);
  return round((taxAmount / (amount - taxAmount)) * 100, 2);
};

export const getTaxInfoFromTransaction = (transaction) => {
  if (transaction.taxInfo) {
    return {
      ...transaction.taxInfo,
      rate: transaction.taxInfo.rate || round(getTransactionTaxPercent(transaction) / 100, 4),
      type: transaction.taxInfo.type || transaction.taxInfo.id || 'Tax',
    };
  } else if (transaction.order?.data?.tax) {
    return {
      type: transaction.order.data.tax.id || 'Tax',
      rate: transaction.order.data.tax.rate || round(getTransactionTaxPercent(transaction) / 100, 4),
      idNumber: transaction.order.data.tax.taxIDNumber,
    };
  }
};

export const getTaxIdNumbersFromTransactions = (transactions) => {
  const taxesSummary = transactions.map(getTaxInfoFromTransaction).filter((t) => t?.idNumber);
  const uniqTaxInfo = uniqBy(taxesSummary, (s) => `${s.type}-${s.idNumber}`);
  return uniqTaxInfo;
};

/**
 * Get a list of taxes
 * @returns {Array} like [{ key: 'VAT-21', id: 'VAT', percentage: 21, amount: 42 }]
 */
export const getTaxesBreakdown = (transactions) => {
  const groupedTransactions = {};
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
    amount: Math.abs(sumBy(taxBreakdown.transactions, (t) => getAmount(t.taxAmount))),
    amountInHostCurrency: Math.round(
      Math.abs(sumBy(taxBreakdown.transactions, (t) => getAmount(t.taxAmount) * (t.hostCurrencyFxRate || 1))),
    ),
  }));
};
