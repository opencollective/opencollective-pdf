import React from 'react';
import PropTypes from 'prop-types';
import { Tr, Td } from './StyledTable';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { formatAmount, formatCurrency } from '../lib/utils';
import { round, sumBy, uniq } from 'lodash';
import { Span } from './styled-components/Text';
import { getItemAmounts } from '../lib/expenses';

const ExpenseItemsTable = ({ items, expense }) => {
  const allTaxTypes = uniq(expense.taxes.map((tax) => tax.type));
  const taxType = allTaxTypes.length === 1 ? allTaxTypes[0] : 'Tax';
  const taxRate = sumBy(expense.taxes, 'rate') || 0;
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <Tr background="#ebf4ff" borderRadius="4px">
          <Td fontSize="12px" fontWeight={500} borderRadius="4px 0 0 4px" width={50}>
            <FormattedMessage id="date" defaultMessage="Date" />
          </Td>
          <Td fontSize="12px" fontWeight={500}>
            <FormattedMessage id="description" defaultMessage="Description" />
          </Td>
          <Td fontSize="12px" fontWeight={500} textAlign="right">
            <FormattedMessage defaultMessage="Gross amount" />
          </Td>
          <Td fontSize="12px" fontWeight={500} textAlign="right">
            {taxType} {Boolean(taxRate) && <small>({round(taxRate * 100, 2)}%)</small>}
          </Td>
          <Td fontSize="12px" fontWeight={500} textAlign="right">
            <FormattedMessage id="amount" defaultMessage="Net Amount" />
          </Td>
        </Tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const amounts = getItemAmounts(item);
          return (
            <tr key={item.id}>
              <Td fontSize="11px" width={50}>
                <FormattedDate value={new Date(item.incurredAt)} day="2-digit" month="2-digit" year="numeric" />
              </Td>
              <Td fontSize="11px">
                {item.description || (
                  <Span color="black.500" fontStyle="italic">
                    <FormattedMessage id="NoDescription" defaultMessage="No description provided" />
                  </Span>
                )}
              </Td>
              <Td textAlign="right">
                {!amounts.inItemCurrency.exchangeRate ? (
                  formatAmount(amounts.inItemCurrency, { showCurrencySymbol: true })
                ) : (
                  <div>
                    {formatAmount(amounts.inExpenseCurrency, { showCurrencySymbol: true })}
                    <small>
                      {' ('}
                      {formatAmount(amounts.inItemCurrency, { showCurrencySymbol: true })}
                      {' * '}
                      {amounts.inItemCurrency.exchangeRate.value}
                      {')'}
                    </small>
                  </div>
                )}
              </Td>
              <Td textAlign="right">
                {formatCurrency(amounts.inExpenseCurrency.valueInCents * taxRate, amounts.inExpenseCurrency.currency)}
              </Td>
              <Td textAlign="right">
                {formatCurrency(
                  amounts.inExpenseCurrency.valueInCents * (1 + taxRate),
                  amounts.inExpenseCurrency.currency,
                )}
              </Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ExpenseItemsTable.propTypes = {
  expense: PropTypes.shape({
    currency: PropTypes.string,
    taxes: PropTypes.array,
  }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      amountV2: PropTypes.object,
      description: PropTypes.string,
      incurredAt: PropTypes.string,
    }),
  ),
};

export default ExpenseItemsTable;
