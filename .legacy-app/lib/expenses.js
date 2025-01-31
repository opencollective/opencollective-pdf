import { round, sumBy } from 'lodash';
import { getCurrencyPrecision } from './utils';

export const getItemAmounts = (item) => {
  if (!item.amountV2.exchangeRate) {
    return { inItemCurrency: item.amountV2, inExpenseCurrency: item.amountV2 };
  } else {
    return {
      inItemCurrency: item.amountV2,
      inExpenseCurrency: {
        currency: item.amountV2.exchangeRate.toCurrency,
        valueInCents: round(
          item.amountV2.valueInCents * item.amountV2.exchangeRate.value,
          getCurrencyPrecision(item.amountV2.exchangeRate.toCurrency),
        ),
      },
    };
  }
};

export const sumItemsInExpenseCurrency = (items) => {
  return sumBy(items, (item) => getItemAmounts(item).inExpenseCurrency.valueInCents);
};
