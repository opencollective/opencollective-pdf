import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, chunk, sumBy, max, isNil, round, uniqBy } from 'lodash';
import { Box, Flex } from '@opencollective/frontend-components/components/Grid';
import moment from 'moment';
import QRCode from 'qrcode.react';

import { formatCurrency, getTransactionUrl } from '../lib/utils';
import { Tr, Td } from './StyledTable';
import LinkToCollective from './LinkToCollective';

import GiftCardImgSrc from '../public/static/images/giftcard.png';
import CollectiveAddress from './CollectiveAddress';
import {
  getTransactionReceiver,
  getTransactionTaxPercent,
  getTaxIdNumbersFromTransactions,
  getTaxesBreakdown,
  getTaxInfoFromTransaction,
} from '../lib/transactions';
import PageFormat from '../lib/constants/page-format';
import CollectiveFooter from './CollectiveFooter';
import CustomIntlDate from './CustomIntlDate';
import AccountName from './AccountName';
import StyledLink from '@opencollective/frontend-components/components/StyledLink';
import { H1, H2, P, Span } from '@opencollective/frontend-components/components/Text';
import Container from '@opencollective/frontend-components/components/Container';
import StyledTag from '@opencollective/frontend-components/components/StyledTag';
import StyledHr from '@opencollective/frontend-components/components/StyledHr';
import { EventDescription } from './EventDescription';
import { formatPaymentMethodName } from '../lib/payment-methods';

export class Receipt extends React.Component {
  static propTypes = {
    /** The receipt data */
    receipt: PropTypes.shape({
      dateFrom: PropTypes.string,
      dateTo: PropTypes.string,
      currency: PropTypes.string.isRequired,
      totalAmount: PropTypes.number,
      fromAccount: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string,
        legalName: PropTypes.string,
        settings: PropTypes.shape({
          VAT: PropTypes.shape({
            number: PropTypes.string,
          }),
        }),
      }).isRequired,
      fromAccountHost: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
      }),
      host: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        website: PropTypes.string,
        imageUrl: PropTypes.string,
      }),
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          paymentMethod: PropTypes.object,
          toAccount: PropTypes.shape({
            type: PropTypes.string,
            startsAt: PropTypes.string,
            endsAt: PropTypes.string,
          }),
          order: PropTypes.shape({
            id: PropTypes.string,
            legacyId: PropTypes.number,
            type: PropTypes.string,
            tier: PropTypes.shape({
              type: PropTypes.string,
            }),
          }),
        }),
      ).isRequired,
      /** The receipt template that should be used **/
      template: PropTypes.shape({
        title: PropTypes.string,
        info: PropTypes.string,
      }),
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
    const billToAddressSize = countLines(get(this.getBillTo(), 'location.address') || '');
    const totalTextSize = billFromAddressSize + billToAddressSize;
    const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - totalTextSize]);

    // If we don't need to put the logo on first page then let's use all the space available
    const nbOnFirstPage = transactions.length > baseNbOnFirstPage ? baseNbOnFirstPage : maxNbOnFirstPage;

    return [
      transactions.slice(0, nbOnFirstPage),
      ...chunk(transactions.slice(nbOnFirstPage, transactions.length), transactionsPerPage),
    ];
  }

  getBillTo() {
    const { fromAccount, fromAccountHost } = this.props.receipt;
    return fromAccountHost || fromAccount;
  }

  /** Generate a prettier reference for receipt by taking only the first part of the hash */
  getReceiptReference() {
    const { receipt } = this.props;
    const billTo = this.getBillTo();
    const hostSlug = receipt.host.slug;
    let reference, contributionId;
    if (receipt.dateFrom && receipt.dateTo) {
      const startString = moment.utc(receipt.dateFrom).format('YYYYMMDD');
      const endString = moment.utc(receipt.dateTo).format('YYYYMMDD');
      reference = `${hostSlug}_${billTo.slug}_${startString}-${endString}`;
    } else if (receipt.transactions.length === 1) {
      const transactionId = receipt.transactions[0].id;
      contributionId = receipt.transactions[0].order?.legacyId;
      reference = `${hostSlug}_${transactionId}`;
    } else {
      reference = `${hostSlug}_${billTo.slug}`;
    }

    return (
      <Container fontSize="12px">
        <div>
          <FormattedMessage defaultMessage="Reference: {reference}" values={{ reference }} />
        </div>
        {contributionId && (
          <div>
            <FormattedMessage defaultMessage="Contribution #{id}" values={{ id: contributionId }} />
          </div>
        )}
      </Container>
    );
  }

  getTaxTotal() {
    const getTaxAmountInHostCurrency = (t) => Math.abs(t.taxAmount?.valueInCents) * (t.hostCurrencyFxRate || 1);
    return Math.round(sumBy(this.props.receipt.transactions, (t) => getTaxAmountInHostCurrency(t) || 0));
  }

  /** Returns the VAT number of the collective */
  renderBillToTaxIdNumbers() {
    const { fromAccount, fromAccountHost, transactions } = this.props.receipt;
    const taxesSummary = getTaxIdNumbersFromTransactions(transactions);

    // Expenses rely solely on the tax info stored in transactions. For orders, we look in the fromCollective
    if (!transactions.every((t) => t.kind === 'EXPENSE')) {
      const getVatNumberFromAccount = (a) => a?.settings?.VAT?.number;
      if (getVatNumberFromAccount(fromAccount)) {
        taxesSummary.push({ type: 'VAT', idNumber: getVatNumberFromAccount(fromAccount) });
      } else if (getVatNumberFromAccount(fromAccountHost)) {
        taxesSummary.push({ type: 'VAT', idNumber: getVatNumberFromAccount(fromAccountHost) });
      }
    }

    const uniqTaxInfo = uniqBy(taxesSummary, (s) => `${s.type}-${s.idNumber}`);
    if (uniqTaxInfo.length) {
      return uniqTaxInfo.map(({ idNumber, type }) => (
        <P fontSize="12px" mt={1} fontWeight="normal" key={`${type}-${idNumber}`}>
          {type}: {idNumber}
        </P>
      ));
    }

    return null;
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
        <img src={GiftCardImgSrc} alt="" style={{ verticalAlign: 'middle', height: '1em', marginRight: '4px' }} />
        <LinkToCollective collective={targetCollective}>{transactionDescription}</LinkToCollective>
      </div>
    );
  }

  getTaxColumnHeader(transactions) {
    const taxInfoList = transactions.map(getTaxInfoFromTransaction).filter(Boolean);
    const taxTypes = uniqBy(taxInfoList, (t) => t.type);
    return taxTypes.length !== 1 ? <FormattedMessage defaultMessage="Tax" /> : taxTypes[0].type;
  }

  renderTransactionsTable(transactions) {
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <Tr background="#ebf4ff" borderRadius="4px">
            <Td fontSize="13px" fontWeight={500} borderRadius="4px 0 0 4px" width="60px">
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
              {this.getTaxColumnHeader(transactions)}
            </Td>
            <Td fontSize="13px" fontWeight={500} textAlign="right" borderRadius="0 4px 4px 0">
              <FormattedMessage id="netAmount" defaultMessage="Net Amount" />
            </Td>
          </Tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const quantity = get(transaction, 'order.quantity') || 1;
            const amountInHostCurrency = transaction.amountInHostCurrency.valueInCents;
            const taxAmount = Math.abs(transaction.taxAmount?.valueInCents || 0);
            const hostCurrencyFxRate = transaction.hostCurrencyFxRate || 1;
            const taxAmountInHostCurrency = taxAmount * hostCurrencyFxRate;
            const grossPriceInHostCurrency =
              amountInHostCurrency - (transaction.isRefund ? -taxAmountInHostCurrency : taxAmountInHostCurrency);
            const unitGrossPriceInHostCurrency = Math.abs(grossPriceInHostCurrency / quantity);
            const transactionCurrency = transaction.hostCurrency || this.props.receipt.currency;
            const isRefunded = !transaction.isRefund && transaction.refundTransaction;
            return (
              <tr key={transaction.id}>
                <Td fontSize="11px">
                  <CustomIntlDate date={new Date(transaction.createdAt)} />
                </Td>
                <Td fontSize="11px">
                  {isRefunded && (
                    <StyledTag
                      fontWeight="500"
                      fontSize="10px"
                      px="4px"
                      py="2px"
                      color="black.900"
                      display="inline"
                      mr={1}
                      letterSpacing="0"
                    >
                      <FormattedMessage defaultMessage="REFUNDED" />
                    </StyledTag>
                  )}
                  {this.transactionDescription(transaction)}
                </Td>
                <Td fontSize="11px" textAlign="center">
                  {quantity}
                </Td>
                <Td fontSize="11px" textAlign="center">
                  {formatCurrency(unitGrossPriceInHostCurrency, transactionCurrency)}
                  {transaction.amountInHostCurrency.currency !== transaction.amount.currency && (
                    <P fontSize="8px" color="black.600" mt={1}>
                      (
                      {formatCurrency(
                        (transaction.amount.valueInCents - taxAmount) / quantity,
                        transaction.amount.currency,
                      )}
                      &nbsp;x&nbsp;
                      {round(transaction.hostCurrencyFxRate, 4)}%)
                    </P>
                  )}
                </Td>
                <Td fontSize="11px" textAlign="center">
                  {isNil(transaction.taxAmount) ? '-' : `${getTransactionTaxPercent(transaction)}%`}
                </Td>
                <Td textAlign="right">{formatCurrency(amountInHostCurrency, transactionCurrency)}</Td>
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

    const chunkedTransactions = this.chunkTransactions(receipt, transactions);
    const taxesTotal = this.getTaxTotal();
    const billTo = this.getBillTo();
    const isSingleTransaction = transactions.length === 1;
    const isTicketOrder = isSingleTransaction && get(transactions[0], 'order.tier.type') === 'TICKET';
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
                          <AccountName account={receipt.host} />
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
                          <AccountName account={billTo} />
                        </P>
                        <CollectiveAddress collective={billTo} />
                        {this.renderBillToTaxIdNumbers()}
                      </Box>
                    </Box>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <Box>
                      <H2 fontSize="16px" lineHeight="18px">
                        {receipt.template?.title || (
                          <FormattedMessage id="invoice.donationReceipt" defaultMessage="Payment Receipt" />
                        )}
                      </H2>
                      <div>
                        {receipt.dateFrom && (
                          <div>
                            <CustomIntlDate date={new Date(receipt.dateFrom)} />
                          </div>
                        )}
                        {receipt.dateTo && (
                          <div>
                            <label>To:</label> <CustomIntlDate date={new Date(receipt.dateTo)} />
                          </div>
                        )}
                      </div>
                      <Box mt={2}>{this.getReceiptReference()}</Box>
                      {transactions.length === 1 && transactions[0].paymentMethod && (
                        <div>
                          <label>
                            <FormattedMessage defaultMessage="Payment Method:" />
                          </label>{' '}
                          {formatPaymentMethodName(transactions[0].paymentMethod)}
                        </div>
                      )}
                    </Box>
                    {isTicketOrder && (
                      <Box>
                        <QRCode
                          renderAs="svg"
                          value={getTransactionUrl(receipt.transactions[0])}
                          size={256}
                          fgColor="#313233"
                          style={{ width: '72px', height: '72px' }}
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>
              )}
              {Boolean(isTicketOrder && receipt.transactions[0].toAccount.type === 'EVENT') && (
                <P fontSize="12px" mb={3}>
                  <EventDescription event={receipt.transactions[0].toAccount} />
                </P>
              )}
              <Box id="invoice-content" width={1} css={{ flexGrow: 1 }}>
                {this.renderTransactionsTable(transactionsChunk)}
                {pageNumber === chunkedTransactions.length - 1 && (
                  <Flex justifyContent="flex-end" mt={3}>
                    <Container width={0.5} fontSize="12px">
                      <StyledHr borderColor="black.200" />
                      <Box p={3} minWidth={225}>
                        <Flex justifyContent="space-between">
                          <FormattedMessage id="subtotal" defaultMessage="Subtotal" />
                          <Span fontWeight="bold">
                            {formatCurrency(receipt.totalAmount - taxesTotal, receipt.currency, {
                              showCurrencySymbol: true,
                            })}
                          </Span>
                        </Flex>
                        {getTaxesBreakdown(this.props.receipt.transactions).map((tax) => (
                          <Flex key={tax.id} justifyContent="space-between" mt={2}>
                            {tax.info.type} ({round(tax.info.rate * 100, 2)}%)
                            <Span fontWeight="bold">
                              {formatCurrency(tax.amountInHostCurrency, receipt.currency, { showCurrencySymbol: true })}
                            </Span>
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
                        <Span>
                          {formatCurrency(receipt.totalAmount, receipt.currency, { showCurrencySymbol: true })}
                        </Span>
                      </Flex>
                    </Container>
                  </Flex>
                )}
              </Box>

              {pageNumber === chunkedTransactions.length - 1 && (
                <Flex flex="3" flexDirection="column" justifyContent="space-between">
                  <Box>
                    <P fontSize="11px" textAlign="left" whiteSpace="pre-wrap">
                      {receipt?.template?.info}
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

export default injectIntl(Receipt);
