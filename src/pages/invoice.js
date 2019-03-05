import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { get, chunk } from 'lodash';
import { Box, Flex, Image } from 'rebass';

import { countries as countriesEN } from 'i18n-iso-countries/langs/en.json';

import { formatCurrency, imagePreview } from '../lib/utils';
import withIntl from '../lib/withIntl';
import { H1, H2, P, Span } from '../components/Text';
import { Tr, Td } from '../components/StyledTable';
import StyledHr from '../components/StyledHr';
import Container from '../components/Container';
import StyledLink from '../components/StyledLink';
import LinkToCollective from '../components/LinkToCollective';

import GiftCardImgSrc from '../static/images/giftcard.png';

const baseUrl = 'https://opencollective.com';

class InvoicePage extends React.Component {
  static getInitialProps({ query: { pageFormat, invoice, debug } }) {
    return { invoice, pageFormat, debug };
  }

  static propTypes = {
    invoice: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired, // from withIntl
    pageFormat: PropTypes.oneOf(['A4', 'Letter']),
    /**
     * As we don't have access to the console for PDFs, debugging can sometimes
     * be tricky. Set this flag to display useful information directly on the
     * document.
     */
    debug: PropTypes.bool,
  };

  static defaultProps = {
    pageFormat: 'A4',
    debug: false,
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

  static transactionsOnFirstPage = 13;

  static transactionsPerPage = 20;

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
   * to keep some space for the header.
   */
  chunkTransactions(transactions) {
    return [
      transactions.slice(0, InvoicePage.transactionsOnFirstPage),
      ...chunk(
        transactions.slice(InvoicePage.transactionsOnFirstPage, transactions.length),
        InvoicePage.transactionsPerPage,
      ),
    ];
  }

  /** Generate a prettier reference for invoice by taking only the first part of the hash */
  getInvoiceReference(invoice) {
    if (!invoice.slug.startsWith('transaction-')) {
      return invoice.slug;
    }

    return invoice.slug
      .split('-')
      .slice(0, 2)
      .join('-');
  }

  /** Given a transaction, return the collective that receive the money */
  getTransactionReceiver(transaction) {
    return transaction.type === 'CREDIT' ? transaction.collective : transaction.fromCollective;
  }

  /** Get amount in host currency for transaction */
  renderTransactionAmountInHostCurrency(transaction) {
    const amount = transaction.type === 'CREDIT' ? transaction.amount : transaction.netAmountInCollectiveCurrency * -1;
    return formatCurrency(amount, transaction.hostCurrency);
  }

  /** Get a description for transaction, with a mention to virtual card emitter if necessary */
  transactionDescription(transaction) {
    const targetCollective = this.getTransactionReceiver(transaction);
    const transactionDescription = (
      <LinkToCollective collective={targetCollective}>
        {transaction.description || targetCollective.name || targetCollective.slug}
      </LinkToCollective>
    );

    return !transaction.usingVirtualCardFromCollective ? (
      transactionDescription
    ) : (
      <div>
        <FormattedMessage
          id="transaction.description.giftCard"
          defaultMessage="{description} by {fromCollectiveLink}"
          values={{
            description: transactionDescription,
            fromCollectiveLink: (
              <LinkToCollective
                collective={transaction.type === 'CREDIT' ? transaction.fromCollective : transaction.collective}
              />
            ),
          }}
        />
        <Image src={GiftCardImgSrc} alt=" | " height="1em" mx={2} css={{ verticalAlign: 'middle' }} />
      </div>
    );
  }

  /** Pretty render a location (multiline) */
  renderLocation(collective) {
    const address = get(collective, 'location.address');
    const country = collective.countryISO && (countriesEN[collective.countryISO] || collective.countryISO);
    return (
      <React.Fragment>
        {address &&
          address.split(',').map((addressPart, idx) => (
            <span key={idx}>
              {addressPart.trim()}
              <br />
            </span>
          ))}
        {country}
      </React.Fragment>
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
              <FormattedMessage id="taxPercent" defaultMessage="Tax&nbsp;%" />
            </Td>
            <Td fontSize="LeadParagraph" fontWeight={500} textAlign="right" borderRadius="0 4px 4px 0">
              <FormattedMessage id="total" defaultMessage="Total" />
            </Td>
          </Tr>
        </thead>
        <tbody>
          {transactions.map(transaction => {
            return (
              <tr key={transaction.id}>
                <Td fontSize="Caption">
                  <FormattedDate value={new Date(transaction.createdAt)} day="2-digit" month="2-digit" year="numeric" />
                </Td>
                <Td fontSize="Caption">{this.transactionDescription(transaction)}</Td>
                <Td fontSize="Caption" textAlign="center">
                  0%
                </Td>
                <Td textAlign="right">{this.renderTransactionAmountInHostCurrency(transaction)}</Td>
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

    const chunkedTransactions = this.chunkTransactions(transactions);

    return (
      <div className={`InvoicePages ${invoice.fromCollective.slug}`}>
        <style jsx global>
          {`
            html {
              /* See https://github.com/marcbachmann/node-html-pdf/issues/110 */
              zoom: 0.75;
            }

            body {
              width: ${this.getPageWith()};
              padding: 0;
              margin: 0;
              font-family: sans-serif;
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
                      <Box my={2}>{this.renderLocation(invoice.host)}</Box>
                      <StyledLink href={`https://opencollective.com/${invoice.host.slug}`} className="website">
                        https://opencollective.com/{invoice.host.slug}
                      </StyledLink>
                    </Box>
                    <Box mt={80} css={{ textAlign: 'right', minHeight: 100 }}>
                      <H2>
                        <FormattedMessage id="billTo" defaultMessage="Bill to" />
                      </H2>
                      <Box my={2}>
                        <P fontWeight={500} fontSize="LeadParagraph">
                          {invoice.fromCollective.name}
                        </P>
                        {this.renderLocation(invoice.fromCollective)}
                      </Box>
                    </Box>
                  </Flex>

                  <Box>
                    <H2>{invoice.title || 'Donation Receipt'}</H2>
                    <div className="detail">
                      <label>Date:</label>{' '}
                      <FormattedDate
                        value={new Date(invoice.year, invoice.month, invoice.day)}
                        day="2-digit"
                        month="2-digit"
                        year="numeric"
                      />
                    </div>
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
                          <Span fontWeight="bold">{formatCurrency(invoice.totalAmount, invoice.currency)}</Span>
                        </Flex>
                        <Flex justifyContent="space-between" mt={2}>
                          <FormattedMessage id="taxes" defaultMessage="Taxes" />
                          <Span fontWeight="bold">{formatCurrency(0, invoice.currency)}</Span>
                        </Flex>
                      </Box>
                      <Container
                        display="flex"
                        justifyContent="space-between"
                        px={3}
                        py={2}
                        background="#ebf4ff"
                        fontWeight="bold"
                      >
                        <FormattedMessage id="total" defaultMessage="Total" />
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
                      {this.renderLocation(invoice.host)}
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

export default withIntl(InvoicePage);
