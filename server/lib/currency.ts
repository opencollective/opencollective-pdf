import { isNil } from 'lodash-es';
import { ZERO_DECIMAL_CURRENCIES } from '../constants/currency';

export function getCurrencyPrecision(currency: string) {
  return (ZERO_DECIMAL_CURRENCIES as readonly string[]).includes(currency) ? 0 : 2;
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  options: {
    minimumFractionDigits?: number;
    precision?: number;
    showCurrencySymbol?: boolean;
  } = {},
) {
  amount = amount / 100;

  const defaultPrecision = getCurrencyPrecision(currency);
  let minimumFractionDigits = defaultPrecision;
  let maximumFractionDigits = defaultPrecision;

  if (options.minimumFractionDigits !== undefined) {
    minimumFractionDigits = options.minimumFractionDigits;
  } else if (options.precision !== undefined) {
    minimumFractionDigits = options.precision;
    maximumFractionDigits = options.precision;
  }

  const result = amount.toLocaleString(getLocaleFromCurrency(currency), {
    style: 'currency',
    currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    currencyDisplay: 'symbol',
  });

  if (options.showCurrencySymbol && !/^[A-Z]{2,3}\$/.test(result)) {
    return `${currency} ${result}`;
  } else {
    return result;
  }
}

const getValueInCentsFromAmount = (amount: {
  valueInCents?: number | null;
  value?: number | null;
  currency?: string | null;
}): number | undefined => {
  if (!isNil(amount?.valueInCents)) {
    return amount.valueInCents;
  } else if (!isNil(amount?.value)) {
    return amount.value * 100;
  } else {
    return undefined;
  }
};

export function formatAmount(
  amount: { valueInCents?: number | null; value?: number | null; currency?: string | null },
  options: {
    minimumFractionDigits?: number;
    precision?: number;
    showCurrencySymbol?: boolean;
  } = {},
) {
  const valueInCents = getValueInCentsFromAmount(amount);
  return isNil(valueInCents) || isNaN(valueInCents)
    ? '--,--'
    : formatCurrency(valueInCents, amount.currency || '??', options);
}

function getLocaleFromCurrency(currency: string) {
  let locale;
  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    case 'EUR':
      locale = 'en-EU';
      break;
    default:
      locale = currency;
  }
  return locale;
}
