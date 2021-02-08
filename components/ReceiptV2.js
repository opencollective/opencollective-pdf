import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, chunk, sumBy, max, uniq, isNil } from 'lodash';
import { Box, Flex, Image } from 'rebass/styled-components';
import moment from 'moment';
import { H1, H2, P, Span } from '@bit/opencollective.design-system.components.styled-text';
import StyledHr from '@bit/opencollective.design-system.components.styled-hr';
import Container from '@bit/opencollective.design-system.components.styled-container';
import StyledLink from '@bit/opencollective.design-system.components.styled-link';

import { formatCurrency } from '../lib/utils';
import { Tr, Td } from './StyledTable';
import LinkToCollective from './LinkToCollective';

import GiftCardImgSrc from '../public/static/images/giftcard.png';
import CollectiveAddress from './CollectiveAddress';
import {
  getTransactionReceiver,
  getTransactionAmount,
  getTransactionTaxPercent,
  getTaxesBreakdownV2,
} from '../lib/transactions';
import PageFormat from '../lib/constants/page-format';
import CollectiveFooter from './CollectiveFooter';
import CustomIntlDate from './CustomIntlDate';

/**
 * Similar to `Receipt`, but for API V2
 */
export class ReceiptV2 extends React.Component {
  static propTypes = {
    /** The receipt data */
    receipt: PropTypes.shape({
      title: PropTypes.string,
      dateFrom: PropTypes.string,
      dateTo: PropTypes.string,
      extraInfo: PropTypes.string,
      currency: PropTypes.string.isRequired,
      totalAmount: PropTypes.number,
      fromAccount: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isIncognito: PropTypes.bool.isRequired,
        createdByUser: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        settings: PropTypes.shape({
          VAT: PropTypes.shape({
            number: PropTypes.string,
          }),
        }),
      }).isRequired,
      host: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      }),
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          order: PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string,
          }),
        }),
      ).isRequired,
    }).isRequired,
    pageFormat: PropTypes.oneOf(['A4', 'Letter']),
    /**
     * As we don't have access to the console for PDFs, debugging can sometimes
     * be tricky. Set this flag to display useful information directly on the
     * document.
     */
    debug: PropTypes.bool,
    /** CSS zoom applied */
    zoom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    intl: PropTypes.object.isRequired, // from withIntl
  };

  static defaultProps = {
    pageFormat: 'A4',
    debug: false,
    zoom: '1',
  };

  // Helpers for page dimension
  getPageWith() {
    const dimensions = PageFormat[this.props.pageFormat];
    return `${dimensions.page.width}${dimensions.unit}`;
  }

  getPageHeight() {
    const dimensions = PageFormat[this.props.pageFormat];
    return `${dimensions.page.height}${dimensions.unit}`;
  }

  /**
   * Chunk transactions, returning less transactions on the first page is we need
   * to keep some space for the header. The number of transactions we show on it depends of
   * the size of the header, that we estimate from the number of lines in the addresses.
   */
  chunkTransactions(receipt, transactions) {
    const baseNbOnFirstPage = 12;
    const minNbOnFirstPage = 8;
    const transactionsPerPage = 22;

    // Estimate the space available
    const countLines = (str) => sumBy(str, (c) => c === '\n') + (str.length > 0 ? 1 : 0);
    const billFromAddressSize = countLines(get(receipt.host, 'location.address') || '');
    const billToAddressSize = countLines(get(receipt.fromAccount, 'location.address') || '');
    const totalTextSize = billFromAddressSize + billToAddressSize;
    const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - totalTextSize]);

    // If we don't need to put the logo on first page then let's use all the space available
    const nbOnFirstPage = transactions.length > baseNbOnFirstPage ? baseNbOnFirstPage : maxNbOnFirstPage;

    return [
      transactions.slice(0, nbOnFirstPage),
      ...chunk(transactions.slice(nbOnFirstPage, transactions.length), transactionsPerPage),
    ];
  }

  /** Generate a prettier reference for receipt by taking only the first part of the hash */
  getReceiptReference(receipt) {
    if (receipt.slug && !receipt.slug.startsWith('transaction-')) {
      return receipt.slug;
    }

    if (receipt.dateFrom && receipt.dateTo) {
      const startString = moment.utc(receipt.dateFrom).format('YYYYMMDD');
      const endString = moment.utc(receipt.dateTo).format('YYYYMMDD');
      return `${receipt.host.slug}_${receipt.fromAccount.slug}_${startString}-${endString}`;
    }

    return receipt.slug.split('-').slice(0, 2).join('-');
  }

  getTaxTotal() {
    return this.props.receipt.transactions.reduce((total, t) => total + (t.taxAmount.valueInCents || 0), 0);
  }

  /** Returns the VAT number of the collective */
  renderTaxIdNumbers() {
    const taxIdNumbers = this.props.receipt.transactions
      .map((t) => get(t, 'order.data.tax.taxIDNumber'))
      .filter((taxIdNumber) => !isNil(taxIdNumber));

    if (taxIdNumbers.length === 0) {
      const { settings } = this.props.receipt.fromAccount;
      if (settings?.VAT?.number) {
        const vatNumber = settings.VAT.number;
        return [<P key={vatNumber}>{vatNumber}</P>];
      }
      return null;
    }

    return uniq(taxIdNumbers).map((number) => <P key={number}>{number}</P>);
  }

  /** Get a description for transaction, with a mention to gift card emitter if necessary */
  transactionDescription(transaction) {
    const targetCollective = getTransactionReceiver(transaction);
    const transactionDescription = (
      <LinkToCollective collective={targetCollective}>
        {transaction.description || targetCollective.name || targetCollective.slug}
      </LinkToCollective>
    );

    return !transaction.giftCardEmitterAccount ? (
      transactionDescription
    ) : (
      <div>
        <Image src={GiftCardImgSrc} alt="" height="1em" mr={1} css={{ verticalAlign: 'middle' }} />
        <LinkToCollective collective={targetCollective}>{transactionDescription}</LinkToCollective>
      </div>
    );
  }

  renderTransactionsTable(transactions) {
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <Tr background="#ebf4ff" borderRadius="4px">
            <Td fontSize="13px" fontWeight={500} borderRadius="4px 0 0 4px">
              <FormattedMessage id="date" defaultMessage="Date" />
            </Td>
            <Td fontSize="13px" fontWeight={500}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </Td>
            <Td fontSize="13px" fontWeight={500} textAlign="center">
              <FormattedMessage id="quantity" defaultMessage="QTY" />
            </Td>
            <Td fontSize="13px" fontWeight={500} textAlign="center" width={80}>
              <FormattedMessage id="unitNetPrice" defaultMessage="Unit Price" />
            </Td>
            <Td fontSize="13px" fontWeight={500} textAlign="center">
              <FormattedMessage id="taxPercent" defaultMessage="Tax&nbsp;%" />
            </Td>
            <Td fontSize="13px" fontWeight={500} textAlign="right" borderRadius="0 4px 4px 0">
              <FormattedMessage id="netAmount" defaultMessage="Net Amount" />
            </Td>
          </Tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const quantity = get(transaction, 'order.quantity') || 1;
            const amount = getTransactionAmount(transaction);
            const taxAmount = transaction.taxAmount.valueInCents || 0;
            const unitGrossPrice = (amount - taxAmount) / quantity;

            return (
              <tr key={transaction.id}>
                <Td fontSize="11px">
                  <CustomIntlDate date={new Date(transaction.createdAt)} />
                </Td>
                <Td fontSize="11px">{this.transactionDescription(transaction)}</Td>
                <Td fontSize="11px" textAlign="center">
                  {quantity}
                </Td>
                <Td fontSize="11px" textAlign="center">
                  {formatCurrency(unitGrossPrice, transaction.currency)}
                </Td>
                <Td fontSize="11px" textAlign="center">
                  {isNil(transaction.taxAmount) ? '-' : `${getTransactionTaxPercent(transaction)}%`}
                </Td>
                <Td textAlign="right">{formatCurrency(amount, transaction.hostCurrency)}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    const { receipt } = this.props;
    if (!receipt) {
      return <div>No receipt to render</div>;
    }
    const { transactions } = receipt;
    if (!transactions || transactions.length === 0) {
      return <div>No transaction to render</div>;
    }

    const { isIncognito, createdByUser } = receipt.fromAccount;
    const chunkedTransactions = this.chunkTransactions(receipt, transactions);
    const taxesTotal = this.getTaxTotal();

    return (
      <div className={`Receipts ${receipt.fromAccount.slug}`}>
        <div className="pages">
          {this.props.debug && (
            <div style={{ padding: 30, background: 'lightgrey', border: '1px solid grey' }}>
              <strong>Dimensions</strong>
              <pre>{JSON.stringify(PageFormat[this.props.pageFormat])}</pre>
              <strong>Receipt</strong>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(this.props.receipt, null, 2)}</pre>
            </div>
          )}
          {chunkedTransactions.map((transactionsChunk, pageNumber) => (
            <Flex
              flexDirection="column"
              className="page"
              key={pageNumber}
              p={5}
              css={{ minHeight: this.getPageHeight() }}
            >
              {pageNumber === 0 && (
                <Box className="header" mb={4}>
                  <Flex flexWrap="wrap" alignItems="flex-start">
                    <Box mb={3} css={{ flexGrow: 1 }}>
                      <StyledLink href={`https://opencollective.com/${receipt.host.slug}`}>
                        <H1 fontSize="18px" lineHeight="20px" m={0} color="black.900">
                          {receipt.host.name}
                        </H1>
                      </StyledLink>
                      <Box my={2}>
                        <CollectiveAddress collective={receipt.host} />
                      </Box>
                      <StyledLink href={`https://opencollective.com/${receipt.host.slug}`} className="website">
                        https://opencollective.com/{receipt.host.slug}
                      </StyledLink>
                    </Box>
                    <Box mt={80} pr={3} css={{ minHeight: 100 }}>
                      <H2 fontSize="16px" lineHeight="18px">
                        <FormattedMessage id="billTo" defaultMessage="Bill to" />
                      </H2>
                      <Box my={2}>
                        <P fontWeight={500} fontSize="13px">
                          {isIncognito ? createdByUser.name : receipt.fromAccount.name}
                        </P>
                        <CollectiveAddress collective={receipt.fromAccount} />
                        {this.renderTaxIdNumbers()}
                      </Box>
                    </Box>
                  </Flex>

                  <Box>
                    <H2 fontSize="16px" lineHeight="18px">
                      {receipt.title || (
                        <FormattedMessage id="invoice.donationReceipt" defaultMessage="Payment Receipt" />
                      )}
                    </H2>
                    <div>
                      <div>
                        <CustomIntlDate date={new Date(receipt.dateFrom)} />
                      </div>
                      <div>
                        <label>To:</label> <CustomIntlDate date={new Date(receipt.dateTo)} />
                      </div>
                    </div>
                    <div className="detail reference">
                      <label>Reference:</label> {this.getReceiptReference(receipt)}
                    </div>
                  </Box>
                </Box>
              )}
              <Box width={1} css={{ flexGrow: 1 }}>
                {this.renderTransactionsTable(transactionsChunk)}
                {pageNumber === chunkedTransactions.length - 1 && (
                  <Flex justifyContent="flex-end" mt={3}>
                    <Container width={0.5} fontSize="12px">
                      <StyledHr borderColor="black.200" />
                      <Box p={3} minWidth={225}>
                        <Flex justifyContent="space-between">
                          <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                          <Span fontWeight="bold">
                            {formatCurrency(receipt.totalAmount - taxesTotal, receipt.currency)}
                          </Span>
                        </Flex>
                        {getTaxesBreakdownV2(this.props.receipt.transactions).map((tax) => (
                          <Flex key={tax.key} justifyContent="space-between" mt={2}>
                            {tax.id === 'VAT' ? (
                              <FormattedMessage
                                id="invoice.vatPercent"
                                defaultMessage="VAT {percentage}%"
                                values={{ percentage: tax.percentage }}
                              />
                            ) : (
                              <FormattedMessage
                                id="invoice.taxPercent"
                                defaultMessage="Tax {percentage}%"
                                values={{ percentage: tax.percentage }}
                              />
                            )}
                            <Span fontWeight="bold">{formatCurrency(tax.amount, receipt.currency)}</Span>
                          </Flex>
                        ))}
                      </Box>
                      <Flex
                        display="flex"
                        justifyContent="space-between"
                        flexBasis="100%"
                        style={{ background: '#ebf4ff', padding: '8px 16px', fontWeight: 'bold' }}
                      >
                        <FormattedMessage id="total" defaultMessage="TOTAL" />
                        <Span>{formatCurrency(receipt.totalAmount, receipt.currency)}</Span>
                      </Flex>
                    </Container>
                  </Flex>
                )}
              </Box>

              {pageNumber === chunkedTransactions.length - 1 && (
                <Flex flex="3" flexDirection="column" justifyContent="space-between">
                  <Box>
                    <P fontSize="11px" textAlign="left" whiteSpace="pre-wrap">
                      {receipt.extraInfo}
                    </P>
                  </Box>
                  <CollectiveFooter collective={receipt.host} />
                </Flex>
              )}
            </Flex>
          ))}
        </div>
      </div>
    );
  }
}

export default injectIntl(ReceiptV2);
