import React from 'react';
import PropTypes from 'prop-types';
import { Tr, Td } from './StyledTable';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { Span } from '@bit/opencollective.design-system.components.styled-text';
import { formatCurrency } from '../lib/utils';
import { round, sumBy, uniq } from 'lodash';

const ExpenseItemsTable = ({ items, expense }) => {
  const allTaxTypes = uniq(expense.taxes.map((tax) => tax.type));
  const taxType = allTaxTypes.length === 1 ? allTaxTypes[0] : 'Tax';
  const taxRate = sumBy(expense.taxes, 'rate');
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
              <Td textAlign="right">{formatCurrency(item.amount, expense.currency)}</Td>
              <Td textAlign="right">{formatCurrency(item.amount * (taxRate || 1), expense.currency)}</Td>
              <Td textAlign="right">{formatCurrency(item.amount * (1 + taxRate), expense.currency)}</Td>
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
      amount: PropTypes.number,
      description: PropTypes.string,
      incurredAt: PropTypes.string,
    }),
  ),
};

export default ExpenseItemsTable;
