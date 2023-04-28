import { get, round, sumBy, uniqBy } from 'lodash';

/** Given a transaction, return the collective that receive the money */
export const getTransactionReceiver = (transaction) => {
  return transaction.type === 'CREDIT' ? transaction.toAccount : transaction.fromAccount;
};

/**
 * Return the tax percentage applied for this transaction
 * TODO: More from percentage (10) to rate (.10)
 */
export const getTransactionTaxPercent = (transaction) => {
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
    amount: Math.abs(sumBy(taxBreakdown.transactions, (t) => t.taxAmount?.valueInCents)),
    amountInHostCurrency: Math.round(
      Math.abs(sumBy(taxBreakdown.transactions, (t) => t.taxAmount?.valueInCents * (t.hostCurrencyFxRate || 1))),
    ),
  }));
};

export const getHostFromTransaction = (transaction) => {
  if (transaction.host) {
    return transaction.host;
  } else if (transaction.type === 'CREDIT') {
    return transaction.fromAccount?.host;
  } else {
    return transaction.toAccount?.host;
  }
};
