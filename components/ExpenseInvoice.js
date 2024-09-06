import { chunk, get, max, round, sumBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Box, Flex } from './styled-components/Grid';
import PageFormat from '../lib/constants/page-format';
import { formatCurrency } from '../lib/utils';
import AccountName from './AccountName';
import CollectiveAddress from './CollectiveAddress';
import ExpenseItemsTable from './ExpenseItemsTable';
import StyledLink from './styled-components/StyledLink';
import { H2, P, Span } from './styled-components/Text';
import Container from './styled-components/Container';
import StyledHr from './styled-components/StyledHr';
import { sumItemsInExpenseCurrency } from '../lib/expenses';

const getPageHeight = (pageFormat) => {
  const dimensions = PageFormat[pageFormat];
  return `${dimensions.page.height}${dimensions.unit}`;
};

/**
 * Chunk expense items, returning less items on the first page is we need
 * to keep some space for the header. The number of items we show on it depends of
 * the size of the header, that we estimate from the number of lines in the addresses.
 */
const chunkItems = (expense, billToAccount) => {
  const baseNbOnFirstPage = 12;
  const minNbOnFirstPage = 8;
  const itemsPerPage = 22;

  // Estimate the space available
  const countLines = (str) => sumBy(str, (c) => c === '\n');
  const billFromAddressSize = countLines(get(expense.payeeLocation, 'address', ''));
  const billToAddressSize = countLines(
    get(billToAccount, 'location.address', '') || get(billToAccount, 'host.location.address', ''),
  );
  const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - (billFromAddressSize + billToAddressSize)]);

  // If we don't need to put the logo on first page then let's use all the space available
  const items = expense.items;
  const nbOnFirstPage = items.length > baseNbOnFirstPage ? baseNbOnFirstPage : maxNbOnFirstPage;

  return [items.slice(0, nbOnFirstPage), ...chunk(items.slice(nbOnFirstPage, items.length), itemsPerPage)];
};

const getBillTo = (expense) => {
  const billToType = get(expense, 'account.host.settings.invoice.expenseTemplates.default.billTo', 'host');
  if (billToType === 'collective') {
    return expense.account;
  } else {
    return expense.account.host || expense.account;
  }
};

const ExpenseInvoice = ({ expense, pageFormat }) => {
  if (!expense) {
    return <div>Could not retrieve the information for this expense.</div>;
  }

  const { account, payee, payeeLocation } = expense;
  const billToAccount = getBillTo(expense);
  const chunkedItems = chunkItems(expense, billToAccount);
  const grossAmount = sumItemsInExpenseCurrency(expense.items);
  return (
    <div>
      {chunkedItems.map((itemsChunk, pageNumber) => (
        <Flex flexDirection="column" key={pageNumber} p={5} css={{ minHeight: getPageHeight(pageFormat) }}>
          {pageNumber === 0 && (
            <Box mb={4}>
              <Flex flexWrap="wrap" alignItems="flex-start">
                <Box mb={3} css={{ flexGrow: 1 }}>
                  <Box my={2}>
                    <H2 fontSize="16px" lineHeight="18px" mb={1}>
                      <FormattedMessage id="billFrom" defaultMessage="From" />
                    </H2>
                    <StyledLink href={`https://opencollective.com/${payee.slug}`}>
                      <P fontWeight="bold" fontSize="13px" color="black.800">
                        <AccountName account={payee} />
                      </P>
                    </StyledLink>
                    <CollectiveAddress collective={{ location: payeeLocation }} />
                  </Box>
                </Box>
                <Box mt={80} pr={3} css={{ minHeight: 100 }}>
                  <H2 fontSize="16px" lineHeight="18px" mb={1}>
                    <FormattedMessage id="billTo" defaultMessage="Bill to" />
                  </H2>
                  <StyledLink href={`https://opencollective.com/${billToAccount.slug}`}>
                    <P fontWeight="bold" fontSize="13px" color="black.800">
                      <AccountName account={billToAccount} />
                    </P>
                  </StyledLink>
                  <Box mb={2}>
                    <CollectiveAddress collective={billToAccount} fallBackOnHostAddress />
                  </Box>
                </Box>
              </Flex>

              <Box mt={4}>
                <StyledLink href={`https://opencollective.com/${account.slug}/expenses/${expense.legacyId}`}>
                  <H2 fontSize="16px" lineHeight="18px" mb={1} color="black.900" css={{ textDecoration: 'underline' }}>
                    <FormattedMessage
                      id="Expense.Description"
                      defaultMessage="Expense #{id}: {description}"
                      values={{ id: expense.legacyId, description: expense.description }}
                    />
                  </H2>
                </StyledLink>
                {expense.reference && (
                  <P fontSize="13px" color="black.900">
                    <FormattedMessage
                      id="Expense.Reference"
                      defaultMessage="Reference: {reference}"
                      values={{ reference: expense.reference }}
                    />
                  </P>
                )}
                <FormattedMessage
                  id="CollectiveColumn"
                  defaultMessage="Collective: {collectiveName}"
                  values={{ collectiveName: <AccountName account={account} /> }}
                />
                <br />
                <FormattedMessage
                  id="DateLabel"
                  defaultMessage="Date: {date, date, full}"
                  values={{ date: new Date(expense.createdAt) }}
                />
              </Box>
            </Box>
          )}
          <Box width={1} css={{ flexGrow: 1 }}>
            <ExpenseItemsTable expense={expense} items={itemsChunk} />
            {pageNumber === chunkedItems.length - 1 && (
              <Box>
                <Flex justifyContent="flex-end" mt={3}>
                  <Container width={0.5} fontSize="12px">
                    <StyledHr borderColor="black.200" />
                    <Flex justifyContent="space-between" px={3} py={2}>
                      <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                      <Span fontWeight="bold">
                        {formatCurrency(grossAmount, expense.currency, { showCurrencySymbol: true })}
                      </Span>
                    </Flex>
                    {expense.taxes?.map((tax) => (
                      <Flex key={tax.id} justifyContent="space-between" px={3} py={2}>
                        {tax.type} ({round(tax.rate * 100, 2)}%)
                        <Span fontWeight="bold">
                          {formatCurrency(tax.rate * grossAmount, expense.currency, { showCurrencySymbol: true })}
                        </Span>
                      </Flex>
                    ))}
                    <Container
                      display="flex"
                      justifyContent="space-between"
                      px={3}
                      py={2}
                      background="#ebf4ff"
                      fontWeight="bold"
                    >
                      <FormattedMessage id="total" defaultMessage="TOTAL" />
                      <Span>{formatCurrency(expense.amount, expense.currency, { showCurrencySymbol: true })}</Span>
                    </Container>
                  </Container>
                </Flex>
                {expense.invoiceInfo && (
                  <Flex justifyContent="flex-end" mt={5}>
                    <P whiteSpace="pre" fontStyle="italic" textAlign="right">
                      {expense.invoiceInfo}
                    </P>
                  </Flex>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      ))}
    </div>
  );
};

ExpenseInvoice.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  expense: PropTypes.shape({
    id: PropTypes.string,
    legacyId: PropTypes.number,
    reference: PropTypes.string,
    description: PropTypes.string,
    currency: PropTypes.string,
    type: PropTypes.oneOf(['INVOICE', 'RECEIPT']),
    invoiceInfo: PropTypes.string,
    amount: PropTypes.number,
    createdAt: PropTypes.string,
    account: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      slug: PropTypes.string,
      imageUrl: PropTypes.string,
      location: PropTypes.shape({
        address: PropTypes.string,
        country: PropTypes.string,
      }),
      host: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        slug: PropTypes.string,
        imageUrl: PropTypes.string,
        location: PropTypes.shape({
          address: PropTypes.string,
          country: PropTypes.string,
        }),
      }),
    }),
    payee: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      slug: PropTypes.string,
      imageUrl: PropTypes.string,
    }),
    payeeLocation: PropTypes.shape({
      address: PropTypes.string,
      country: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        amount: PropTypes.number,
        description: PropTypes.string,
        incurredAt: PropTypes.string,
        url: PropTypes.string,
      }),
    ),
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        rate: PropTypes.number,
        type: PropTypes.string,
      }),
    ),
  }),
};

ExpenseInvoice.defaultProps = {
  pageFormat: 'A4',
};

export default ExpenseInvoice;
