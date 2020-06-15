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
import { Tr, Td } from '../components/StyledTable';
import LinkToCollective from '../components/LinkToCollective';

import GiftCardImgSrc from '../public/static/images/giftcard.png';
import CollectiveAddress from '../components/CollectiveAddress';
import {
  getTaxesBreakdown,
  getTransactionReceiver,
  getTransactionAmount,
  getTransactionTaxPercent,
} from '../lib/transactions';
import PageFormat from '../lib/constants/page-format';
import CollectiveFooter from './CollectiveFooter';
import CustomIntlDate from './CustomIntlDate';

export class Receipt extends React.Component {
  static propTypes = {
    /** The invoice data */
    invoice: PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      dateFrom: PropTypes.string,
      dateTo: PropTypes.string,
      extraInfo: PropTypes.string,
      currency: PropTypes.string,
      year: PropTypes.number,
      month: PropTypes.number,
      day: PropTypes.number,
      totalAmount: PropTypes.number,
      fromCollective: PropTypes.shape({
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
  chunkTransactions(invoice, transactions) {
    const baseNbOnFirstPage = 12;
    const minNbOnFirstPage = 8;
    const transactionsPerPage = 22;

    // Estimate the space available
    const countLines = (str) => sumBy(str, (c) => c === '\n') + (str.length > 0 ? 1 : 0);
    const billFromAddressSize = countLines(get(invoice.host, 'location.address') || '');
    const billToAddressSize = countLines(get(invoice.fromCollective, 'location.address') || '');
    const totalTextSize = billFromAddressSize + billToAddressSize;
    const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - totalTextSize]);

    // If we don't need to put the logo on first page then let's use all the space available
    const nbOnFirstPage = transactions.length > baseNbOnFirstPage ? baseNbOnFirstPage : maxNbOnFirstPage;

    return [
      transactions.slice(0, nbOnFirstPage),
      ...chunk(transactions.slice(nbOnFirstPage, transactions.length), transactionsPerPage),
    ];
  }

  /** Generate a prettier reference for invoice by taking only the first part of the hash */
  getInvoiceReference(invoice) {
    if (invoice.slug && !invoice.slug.startsWith('transaction-')) {
      return invoice.slug;
    }

    if (invoice.dateFrom && invoice.dateTo) {
      const startString = moment.utc(invoice.dateFrom).format('YYYYMMDD');
      const endString = moment.utc(invoice.dateTo).format('YYYYMMDD');
      return `${invoice.host.slug}_${invoice.fromCollective.slug}_${startString}-${endString}`;
    }

    return invoice.slug.split('-').slice(0, 2).join('-');
  }

  getTaxTotal() {
    return this.props.invoice.transactions.reduce((total, t) => total + (t.taxAmount || 0), 0);
  }

  /** Returns the VAT number of the collective */
  renderTaxIdNumbers() {
    const taxIdNumbers = this.props.invoice.transactions
      .map((t) => get(t, 'order.data.tax.taxIDNumber'))
      .filter((taxIdNumber) => !isNil(taxIdNumber));

    if (taxIdNumbers.length === 0) {
      const {
        fromCollective: { settings },
      } = this.props.invoice;

      if (settings?.VAT?.number) {
        const vatNumber = settings.VAT.number;
        return [<P key={vatNumber}>{vatNumber}</P>];
      }
      return null;
    }

    return uniq(taxIdNumbers).map((number) => <P key={number}>{number}</P>);
  }

  /** Get a description for transaction, with a mention to virtual card emitter if necessary */
  transactionDescription(transaction) {
    const targetCollective = getTransactionReceiver(transaction);
    const transactionDescription = (
      <LinkToCollective collective={targetCollective}>
        {transaction.description || targetCollective.name || targetCollective.slug}
      </LinkToCollective>
    );

    return !transaction.usingVirtualCardFromCollective ? (
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
            <Td fontSize="LeadParagraph" fontWeight={500} borderRadius="4px 0 0 4px">
              <FormattedMessage id="date" defaultMessage="Date" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500}>
              <FormattedMessage id="description" defaultMessage="Description" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500} textAlign="center">
              <FormattedMessage id="quantity" defaultMessage="QTY" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500} textAlign="center" width={80}>
              <FormattedMessage id="unitNetPrice" defaultMessage="Unit Price" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500} textAlign="center">
              <FormattedMessage id="taxPercent" defaultMessage="Tax&nbsp;%" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500} textAlign="right" borderRadius="0 4px 4px 0">
              <FormattedMessage id="netAmount" defaultMessage="Net Amount" />
            </Td>
          </Tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const quantity = get(transaction, 'order.quantity') || 1;
            const amount = getTransactionAmount(transaction);
            const taxAmount = transaction.taxAmount || 0;
            const unitGrossPrice = (amount - taxAmount) / quantity;

            return (
              <tr key={transaction.id}>
                <Td fontSize="Caption">
                  <CustomIntlDate date={new Date(transaction.createdAt)} />
                </Td>
                <Td fontSize="Caption">{this.transactionDescription(transaction)}</Td>
                <Td fontSize="Caption" textAlign="center">
                  {quantity}
                </Td>
                <Td fontSize="Caption" textAlign="center">
                  {formatCurrency(unitGrossPrice, transaction.currency)}
                </Td>
                <Td fontSize="Caption" textAlign="center">
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
    const { invoice } = this.props;
    if (!invoice) {
      return <div>No invoice to render</div>;
    }
    const { transactions } = invoice;
    if (!transactions || transactions.length === 0) {
      return <div>No transaction to render</div>;
    }

    const { isIncognito, createdByUser } = invoice.fromCollective;
    const chunkedTransactions = this.chunkTransactions(invoice, transactions);
    const taxesTotal = this.getTaxTotal();

    return (
      <div className={`Receipts ${invoice.fromCollective.slug}`}>
        <div className="pages">
          {this.props.debug && (
            <div style={{ padding: 30, background: 'lightgrey', border: '1px solid grey' }}>
              <strong>Dimensions</strong>
              <pre>{JSON.stringify(PageFormat[this.props.pageFormat])}</pre>
              <strong>Invoice</strong>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(this.props.invoice, null, 2)}</pre>
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
                      <StyledLink href={`https://opencollective.com/${invoice.host.slug}`}>
                        <H1 m={0} color="black.900">
                          {invoice.host.name}
                        </H1>
                      </StyledLink>
                      <Box my={2}>
                        <CollectiveAddress collective={invoice.host} />
                      </Box>
                      <StyledLink href={`https://opencollective.com/${invoice.host.slug}`} className="website">
                        https://opencollective.com/{invoice.host.slug}
                      </StyledLink>
                    </Box>
                    <Box mt={80} pr={3} css={{ minHeight: 100 }}>
                      <H2>
                        <FormattedMessage id="billTo" defaultMessage="Bill to" />
                      </H2>
                      <Box my={2}>
                        <P fontWeight={500} fontSize="LeadParagraph">
                          {isIncognito ? createdByUser.name : invoice.fromCollective.name}
                        </P>
                        <CollectiveAddress collective={invoice.fromCollective} />
                        {this.renderTaxIdNumbers()}
                      </Box>
                    </Box>
                  </Flex>

                  <Box>
                    <H2>
                      {invoice.title || (
                        <FormattedMessage id="invoice.donationReceipt" defaultMessage="Payment Receipt" />
                      )}
                    </H2>
                    {invoice.dateFrom && invoice.dateTo ? (
                      <div>
                        <div>
                          <CustomIntlDate date={new Date(invoice.dateFrom)} />
                        </div>
                        <div>
                          <label>To:</label> <CustomIntlDate date={new Date(invoice.dateTo)} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label>Date:</label>{' '}
                        <CustomIntlDate date={new Date(invoice.year, invoice.month - 1, invoice.day)} />
                      </div>
                    )}
                    <div className="detail reference">
                      <label>Reference:</label> {this.getInvoiceReference(invoice)}
                    </div>
                  </Box>
                </Box>
              )}
              <Box width={1} css={{ flexGrow: 1 }}>
                {this.renderTransactionsTable(transactionsChunk)}
                {pageNumber === chunkedTransactions.length - 1 && (
                  <Flex justifyContent="flex-end" mt={3}>
                    <Container width={0.5} fontSize="Paragraph">
                      <StyledHr borderColor="black.200" />
                      <Box p={3} minWidth={225}>
                        <Flex justifyContent="space-between">
                          <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                          <Span fontWeight="bold">
                            {formatCurrency(invoice.totalAmount - taxesTotal, invoice.currency)}
                          </Span>
                        </Flex>
                        {getTaxesBreakdown(this.props.invoice.transactions).map((tax) => (
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
                            <Span fontWeight="bold">{formatCurrency(tax.amount, invoice.currency)}</Span>
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
                        <Span>{formatCurrency(invoice.totalAmount, invoice.currency)}</Span>
                      </Flex>
                    </Container>
                  </Flex>
                )}
              </Box>

              {pageNumber === chunkedTransactions.length - 1 && (
                <Flex flex="3" flexDirection="column" justifyContent="space-between">
                  <Box>
                    <P fontSize="Caption" textAlign="left" whiteSpace="pre-wrap">
                      {invoice.extraInfo}
                    </P>
                  </Box>
                  <CollectiveFooter collective={invoice.host} />
                </Flex>
              )}
            </Flex>
          ))}
        </div>
      </div>
    );
  }
}

export default injectIntl(Receipt);
