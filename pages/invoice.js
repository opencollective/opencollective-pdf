import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get, chunk, sumBy, max, uniq, isNil } from 'lodash';
import { Box, Flex, Image } from 'rebass/styled-components';
import moment from 'moment';

import { formatCurrency, imagePreview } from '../lib/utils';
import withIntl from '../lib/withIntl';
import { H1, H2, P, Span } from '../components/Text';
import { Tr, Td } from '../components/StyledTable';
import StyledHr from '../components/StyledHr';
import Container from '../components/Container';
import StyledLink from '../components/StyledLink';
import LinkToCollective from '../components/LinkToCollective';

import GiftCardImgSrc from '../public/images/giftcard.png';
import CollectiveAddress from '../components/CollectiveAddress';
import {
  getTaxesBreakdown,
  getTransactionReceiver,
  getTransactionAmount,
  getTransactionTaxPercent,
} from '../lib/transactions';

const baseUrl = 'https://opencollective.com';

export class InvoicePage extends React.Component {
  static getInitialProps({ query: { pageFormat, invoice, debug, zoom } }) {
    return { invoice, pageFormat, debug, zoom };
  }

  static propTypes = {
    /** The invoice data */
    invoice: PropTypes.shape({
      title: PropTypes.string,
      slug: PropTypes.string,
      dateFrom: PropTypes.string,
      dateTo: PropTypes.string,
      fromCollective: PropTypes.shape({
        slug: PropTypes.string.isRequired,
      }).isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          order: PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string,
          }).isRequired,
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

  static dimensions = {
    A4: {
      unit: 'mm',
      page: {
        width: 210,
        height: 297,
        footerTop: 245,
      },
    },
    Letter: {
      unit: 'in',
      page: {
        width: 8.5,
        height: 11,
        footerTop: 9,
      },
    },
  };

  // Helpers for page dimension

  getPageWith() {
    const dimensions = InvoicePage.dimensions[this.props.pageFormat];
    return `${dimensions.page.width}${dimensions.unit}`;
  }

  getPageHeight() {
    const dimensions = InvoicePage.dimensions[this.props.pageFormat];
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
    const countLines = str => sumBy(str, c => c === '\n');
    const billFromAddressSize = countLines(get(invoice.host, 'location.address', ''));
    const billToAddressSize = countLines(get(invoice.fromCollective, 'location.address', ''));
    const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - (billFromAddressSize + billToAddressSize)]);

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

    return invoice.slug
      .split('-')
      .slice(0, 2)
      .join('-');
  }

  getTaxTotal() {
    return this.props.invoice.transactions.reduce((total, t) => total + (t.taxAmount || 0), 0);
  }

  /** Returns the VAT number of the collective */
  renderTaxIdNumbers() {
    const taxIdNumbers = this.props.invoice.transactions
      .map(t => get(t, 'order.data.tax.taxIDNumber'))
      .filter(taxIdNumber => !isNil(taxIdNumber));

    if (taxIdNumbers.length === 0) {
      return null;
    }

    return uniq(taxIdNumbers).map(number => <P key={number}>{number}</P>);
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
          {transactions.map(transaction => {
            const quantity = get(transaction, 'order.quantity') || 1;
            const amount = getTransactionAmount(transaction);
            const taxAmount = transaction.taxAmount || 0;
            const unitGrossPrice = (amount - taxAmount) / quantity;

            return (
              <tr key={transaction.id}>
                <Td fontSize="Caption">
                  <FormattedDate value={new Date(transaction.createdAt)} day="2-digit" month="2-digit" year="numeric" />
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

    const chunkedTransactions = this.chunkTransactions(invoice, transactions);
    const taxesTotal = this.getTaxTotal();

    return (
      <div className={`InvoicePages ${invoice.fromCollective.slug}`}>
        <style jsx global>
          {`
            html {
              /* See https://github.com/marcbachmann/node-html-pdf/issues/110 */
              zoom: ${this.props.zoom};
            }

            body {
              width: ${this.getPageWith()};
              padding: 0;
              margin: 0;
              /**
               * The 'Inter UI' must be installed on the machine. We copy the files
               * in Dockerfile to ensure that they are properly installed in production.
               * See https://github.com/marcbachmann/node-html-pdf/issues/430
               */
              font-family: 'Inter UI', 'Inter-UI', DejaVuSans, sans-serif;
              font-weight: normal;
              font-size: 12px;
              line-height: 1.5;
            }
          `}
        </style>
        <div className="pages">
          {this.props.debug && (
            <div style={{ padding: 30, background: 'lightgrey', border: '1px solid grey' }}>
              <strong>Dimensions</strong>
              <pre>{JSON.stringify(InvoicePage.dimensions[this.props.pageFormat])}</pre>
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
                          {invoice.fromCollective.name}
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
                      <RenderDateFromDateTo invoice={invoice} />
                    ) : (
                      <RenderSingleDate invoice={invoice} />
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
                      <Box p={3}>
                        <Flex justifyContent="space-between">
                          <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                          <Span fontWeight="bold">
                            {formatCurrency(invoice.totalAmount - taxesTotal, invoice.currency)}
                          </Span>
                        </Flex>
                        {getTaxesBreakdown(this.props.invoice.transactions).map(tax => (
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
                      <Container
                        display="flex"
                        justifyContent="space-between"
                        px={3}
                        py={2}
                        background="#ebf4ff"
                        fontWeight="bold"
                      >
                        <FormattedMessage id="total" defaultMessage="TOTAL" />
                        <Span>{formatCurrency(invoice.totalAmount, invoice.currency)}</Span>
                      </Container>
                    </Container>
                  </Flex>
                )}
              </Box>
              {pageNumber === chunkedTransactions.length - 1 && (
                <Flex className="footer" justifyContent="center" alignItems="center">
                  <Container borderRight="1px solid" borderColor="black.400" pr={4} mr={4}>
                    <StyledLink href={invoice.host.website}>
                      <Image
                        css={{ maxWidth: 200, maxHeight: 100 }}
                        src={imagePreview(invoice.host.image, null, { height: 200, baseUrl })}
                      />
                    </StyledLink>
                  </Container>
                  <Box>
                    <P fontWeight="bold" textAlign="center">
                      {invoice.host.name}
                    </P>
                    <P mt={2} textAlign="center" color="black.600">
                      <CollectiveAddress collective={invoice.host} />
                    </P>
                  </Box>
                </Flex>
              )}
            </Flex>
          ))}
        </div>
      </div>
    );
  }
}

function RenderDateFromDateTo(props) {
  const { invoice } = props;
  return (
    <div>
      <div className="detail">
        <label>From:</label>{' '}
        <FormattedDate value={new Date(invoice.dateFrom)} day="2-digit" month="2-digit" year="numeric" />
      </div>
      <div className="detail">
        <label>To:</label>{' '}
        <FormattedDate value={new Date(invoice.dateTo)} day="2-digit" month="2-digit" year="numeric" />
      </div>
    </div>
  );
}

RenderDateFromDateTo.propTypes = {
  invoice: PropTypes.object.isRequired,
};

function RenderSingleDate(props) {
  const { invoice } = props;
  return (
    <div className="detail">
      <label>Date:</label>{' '}
      <FormattedDate
        value={new Date(invoice.year, invoice.month - 1, invoice.day)}
        day="2-digit"
        month="2-digit"
        year="numeric"
      />
    </div>
  );
}
RenderSingleDate.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default withIntl(InvoicePage);
