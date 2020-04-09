import React from 'react';
import PropTypes from 'prop-types';
import { Tr, Td } from './StyledTable';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { Span } from '@bit/opencollective.design-system.components.styled-text';
import { formatCurrency } from '../lib/utils';

const ExpenseItemsTable = ({ items, expense }) => {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <Tr background="#ebf4ff" borderRadius="4px">
          <Td fontSize="LeadParagraph" fontWeight={500} borderRadius="4px 0 0 4px" width={50}>
            <FormattedMessage id="date" defaultMessage="Date" />
          </Td>
          <Td fontSize="LeadParagraph" fontWeight={500}>
            <FormattedMessage id="description" defaultMessage="Description" />
          </Td>
          <Td fontSize="LeadParagraph" fontWeight={500} textAlign="right">
            <FormattedMessage id="amount" defaultMessage="Amount" />
          </Td>
        </Tr>
      </thead>
      <tbody>
        {items.map((item) => {
          return (
            <tr key={item.id}>
              <Td fontSize="Caption">
                <FormattedDate value={new Date(item.incurredAt)} day="2-digit" month="2-digit" year="numeric" />
              </Td>
              <Td fontSize="Caption">
                {item.description || (
                  <Span color="black.500" fontStyle="italic">
                    <FormattedMessage id="NoDescription" defaultMessage="No description provided" />
                  </Span>
                )}
              </Td>
              <Td textAlign="right">{formatCurrency(item.amount, expense.currency)}</Td>
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
