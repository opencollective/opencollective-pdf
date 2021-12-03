import { get, groupBy, isNil, isUndefined, round } from 'lodash';

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
 * Check if transaction is a refund, from the proper flag if it comes from V2 or from the
 * description if it comes from V2
 */
export const isRefundTransaction = (transaction) => {
  return !isUndefined(transaction.isRefund)
    ? transaction.isRefund
    : transaction.refundTransaction && transaction.description.startsWith('Refund of');
};

/**
 * For a transaction, return the amount paid as a positive integer
 */
export const getTransactionAmount = (transaction) => {
  return getAmount(transaction.amountInHostCurrency);
};

/**
 * Return the tax percentage applied for this transaction
 */
export const getTransactionTaxPercent = (transaction) => {
  const taxAmount = Math.abs(getAmount(transaction.taxAmount));
  if (!taxAmount) {
    return 0;
  }

  // Try to get it from the order
  const percent = get(transaction, 'order.data.tax.percentage');
  const percentV2 = get(transaction, 'order.taxPercentage');
  if (percent || percentV2) {
    return percent || percentV2;
  }

  // Calculate from amount
  const amount = getTransactionAmount(transaction);
  return round((taxAmount / (amount - taxAmount)) * 100, 2);
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
    amount: groupedTransactions[key].reduce((total, t) => total + Math.abs(t.taxAmount), 0),
    key,
  }));
};

/**
 * Get a list of taxes
 * @returns {Array} like [{ key: 'VAT-21', id: 'VAT', percentage: 21, amount: 42 }]
 */
export const getTaxesBreakdownV2 = (transactions) => {
  const taxes = {};
  transactions.forEach((transaction) => {
    if (transaction.order?.taxes?.length) {
      transaction.order.taxes.forEach((tax) => {
        const key = `${tax.type}-${tax.percentage}`;
        const amount = getTransactionAmount(transaction);
        const grossPrice = amount - Math.abs(transaction.taxAmount.valueInCents || 0);
        const taxAmount = Math.round(grossPrice * (tax.percentage / 100));

        taxes[key] = {
          id: tax.type,
          percentage: tax.percentage,
          amount: (taxes[key]?.amount || 0) + taxAmount,
        };
      });
    } else if (transaction.taxAmount.valueInCents) {
      const percentage = getTransactionTaxPercent(transaction);
      const key = `Tax-${percentage}`;
      taxes[key] = {
        id: 'Tax',
        percentage,
        amount: (taxes[key]?.amount || 0) + Math.abs(transaction.taxAmount.valueInCents || 0),
      };
    }
  });

  return Object.keys(taxes)
    .map((key) => ({ key, ...taxes[key] }))
    .filter((tax) => tax.amount);
};
