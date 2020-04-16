import { get, groupBy } from 'lodash';

/** Given a transaction, return the collective that receive the money */
export const getTransactionReceiver = (transaction) => {
  return transaction.type === 'CREDIT' ? transaction.collective : transaction.fromCollective;
};

/**
 * For a transaction, return the amount paid as a positive integer
 */
export const getTransactionAmount = (transaction) => {
  return transaction.type === 'CREDIT' ? transaction.amount : transaction.netAmountInCollectiveCurrency * -1;
};

/**
 * Return the tax percentage applied for this transaction
 */
export const getTransactionTaxPercent = (transaction) => {
  if (!transaction.taxAmount) {
    return 0;
  }

  // Try to get it from the order
  const percent = get(transaction, 'order.data.tax.percentage');
  if (percent) {
    return percent;
  }

  // Calculate from amount
  const amount = getTransactionAmount(transaction);
  return (transaction.taxAmount / (amount - transaction.taxAmount)) * 100;
};

/**
 * Get a list of taxes
 * @returns {Array} like [{ key: 'VAT-21', id: 'VAT', percentage: 21, amount: 42 }]
 */
export const getTaxesBreakdown = (transactions) => {
  // Get all transactions that have at least a tax amount or a tax ID
  const transactionsWithTax = transactions.filter((t) => {
    return t.taxAmount || get(t, 'order.data.tax.id');
  });

  const groupedTransactions = groupBy(transactionsWithTax, (t) => {
    return `${get(t, 'order.data.tax.id', 'Tax')}-${getTransactionTaxPercent(t)}`;
  });

  return Object.keys(groupedTransactions).map((key) => ({
    id: get(groupedTransactions[key][0], 'order.data.tax.id', 'Tax'),
    percentage: getTransactionTaxPercent(groupedTransactions[key][0]),
    amount: groupedTransactions[key].reduce((total, t) => total + t.taxAmount, 0),
    key,
  }));
};
