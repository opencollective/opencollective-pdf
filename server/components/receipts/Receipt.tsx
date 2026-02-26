import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { get, chunk, sumBy, max, isNil, round, uniqBy } from 'lodash-es';
import QRCode from 'qrcode';
import { FormattedMessage } from 'react-intl';

import { isMemberOfTheEuropeanUnion } from '@opencollective/taxes';
import {
  getTransactionReceiver,
  getTransactionTaxPercent,
  getTaxIdNumbersFromTransactions,
  getTaxesBreakdown,
  getTaxInfoFromTransaction,
  getTransactionUrl,
} from '../../lib/transactions.js';
import { FontFamily } from '../../lib/pdf.js';
import { TimeRange } from '../TimeRange.js';
import CollectiveFooter from '../CollectiveFooter.js';
import { formatCurrency } from '../../../server/lib/currency.js';
import { formatPaymentMethodName } from '../../../server/lib/payment-methods.js';
import { Account, Event, Order, Transaction, PaymentMethod } from '../../../server/graphql/types/v2/graphql.js';
import dayjs from 'dayjs';
import LocationParagraph from '../LocationParagraph.js';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: '#2C3135',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: FontFamily.InterRegular,
  },
  header: {
    marginBottom: 12,
  },
  accountName: {
    fontFamily: FontFamily.InterBold,
    fontSize: 15,
    marginBottom: 2,
    color: '#2C3135',
  },
  addressBlock: {
    marginBottom: 2,
  },
  addressText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  link: {
    color: '#1869F5',
    textDecoration: 'none',
  },
  billTo: {
    fontFamily: FontFamily.InterBold,
    fontSize: 14,
    marginTop: 80,
  },
  receiptTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: 14,
  },
  dateInfo: {
    fontSize: 10,
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 10,
    marginTop: 5,
  },
  qrCode: {
    width: 72,
    height: 72,
    marginLeft: 'auto',
  },
  eventDescription: {
    fontSize: 12,
    marginBottom: 12,
    fontFamily: FontFamily.InterItalic,
  },
  tableContainer: {
    marginTop: 10,
    flexGrow: 1,
  },
  tableHeader: {
    fontFamily: FontFamily.InterBold,
    backgroundColor: '#ebf4ff',
  },
  tableCell: {
    fontSize: 10,
    padding: 6,
    borderColor: '#E0E0E0',
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  tableCellRight: {
    textAlign: 'right',
  },
  totalsContainer: {
    width: '50%',
    marginLeft: 'auto',
    fontSize: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 10,
  },
  totalHighlight: {
    backgroundColor: '#ebf4ff',
    fontFamily: FontFamily.InterBold,
  },
  footerInfo: {
    fontSize: 10,
    fontFamily: FontFamily.InterItalic,
    marginVertical: 10,
    borderLeft: '2 solid lightgrey',
    paddingLeft: 10,
    paddingVertical: 5,
  },
  embeddedImage: {
    marginTop: 10,
    width: 150, // Original width is 300, 1/2 for better resolution
    height: 51, // Original height is 102, 1/2 for better resolution
  },
  textAlignRight: {
    textAlign: 'right',
  },
  warningText: {
    fontSize: 11,
    marginTop: 15,
    textAlign: 'right',
  },
  footer: {
    fontSize: 9,
    color: '#6E747A',
    marginTop: 20,
  },
  refundTag: {
    fontFamily: FontFamily.InterBold,
    fontSize: 10,
    padding: 2,
    marginRight: 4,
    backgroundColor: '#F5F7FA',
    color: '#494D52',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  flexGrow: {
    flexGrow: 1,
  },
  mb3: {
    marginBottom: 12,
  },
  mt3: {
    marginTop: 12,
  },
  mt5: {
    marginTop: 20,
  },
  my2: {
    marginVertical: 8,
  },
  pr3: {
    paddingRight: 12,
  },
  minHeight100: {
    minHeight: 100,
  },
  mt20: {
    marginTop: 20,
  },
  bold: {
    fontFamily: FontFamily.InterBold,
  },
  textSm: {
    fontSize: 13,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  taxInfo: {
    fontSize: 8,
    marginTop: 2,
    color: '#6E747A',
  },
  p3: {
    padding: 12,
  },
  minWidth225: {
    minWidth: 225,
  },
  debugPanel: {
    padding: 30,
    backgroundColor: '#EAEAEA',
    border: '1 solid grey',
  },
  giftCardImage: {
    height: 10,
    width: 14,
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    fontSize: 8,
  },
});

const TableWeighting = {
  date: 0.15,
  descripion: 0.45,
  quantity: 0.05,
  unitPrice: 0.15,
  tax: 0.05,
  netAmount: 0.15,
};

const CustomIntlDate = ({ date }: { date: Date }) => dayjs(date).format('YYYY-MM-DD');

// Event description component
const EventDescription = ({ event }: { event: Event }) => (
  <React.Fragment>
    <FormattedMessage defaultMessage='Registration for "{eventName}"' id="G8WqFT" values={{ eventName: event.name }} />
    {'. '}

    {event.startsAt && (
      <React.Fragment>
        <FormattedMessage defaultMessage="Date:" id="KHko3L" />
        &nbsp;
        <TimeRange startsAt={event.startsAt} endsAt={event.endsAt} timezone={event.timezone} />
      </React.Fragment>
    )}
  </React.Fragment>
);

type Props = {
  /** The receipt data */
  receipt: {
    isRefundOnly?: boolean | null;
    dateFrom?: string;
    dateTo?: string;
    currency: string;
    totalAmount: number;
    fromAccount: Pick<Account, 'name' | 'slug' | 'legalName' | 'location'> & {
      settings?: { VAT?: { number?: string } };
    };
    fromAccountHost?:
      | (Pick<Account, 'name' | 'slug' | 'legalName'> & { settings?: { VAT?: { number?: string } } })
      | null;
    host: Pick<Account, 'name' | 'slug' | 'legalName' | 'location'>;
    transactions: Array<
      Pick<
        Transaction,
        'id' | 'kind' | 'description' | 'createdAt' | 'amountInHostCurrency' | 'isRefund' | 'refundTransaction'
      > & {
        order?: null | (Pick<Order, 'legacyId' | 'data' | 'quantity'> & { tier: Pick<Order['tier'], 'type' | 'name'> });
        paymentMethod?: Pick<Transaction['paymentMethod'], 'name'>;
        taxAmount?: { valueInCents: number; currency: string };
        hostCurrencyFxRate?: number;
        hostCurrency?: string;
        amount: { valueInCents: number; currency: string };
        toAccount?: { type: string; name: string; startsAt?: string; endsAt?: string; timezone?: string };
        giftCardEmitterAccount?: { name: string } | null;
      }
    >;
    template?: {
      title?: string;
      info?: string;
      embeddedImage?: string;
    };
  };
  debug?: boolean; // As we don't have access to the console for PDFs, debugging can sometimes be tricky. Set this flag to display useful information directly on the document.
};

export class Receipt extends React.Component<Props> {
  static defaultProps = {
    debug: false,
  };

  /**
   * Chunk transactions, returning less transactions on the first page is we need
   * to keep some space for the header. The number of transactions we show on it depends of
   * the size of the header, that we estimate from the number of lines in the addresses.
   */
  chunkTransactions(
    receipt: Props['receipt'],
    transactions: Props['receipt']['transactions'],
  ): Array<Array<(typeof transactions)[0]>> {
    const baseNbOnFirstPage = 12;
    const minNbOnFirstPage = 8;
    const transactionsPerPage = 22;

    // Estimate the space available
    const countLines = (str: string) => str.split('\n').length - 1 + (str.length > 0 ? 1 : 0);
    const billFromAddressSize = countLines(get(receipt.host, 'location.address') || '');
    const billToAddressSize = countLines(get(this.getBillTo(), 'location.address') || '');
    const totalTextSize = billFromAddressSize + billToAddressSize;
    const maxNbOnFirstPage = max([minNbOnFirstPage, baseNbOnFirstPage - totalTextSize]);

    // If we need to put the logo on first page then let's use all the space available
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
      const startString = dayjs.utc(receipt.dateFrom).format('YYYYMMDD');
      const endString = dayjs.utc(receipt.dateTo).format('YYYYMMDD');
      reference = `${hostSlug}_${billTo.slug}_${startString}-${endString}`;
    } else if (receipt.transactions.length === 1) {
      const transactionId = receipt.transactions[0].id;
      contributionId = receipt.transactions[0].order?.legacyId;
      reference = `${hostSlug}_${transactionId}`;
    } else {
      reference = `${hostSlug}_${billTo.slug}`;
    }

    return (
      <View>
        <Text>
          <FormattedMessage defaultMessage="Reference: {reference}" id="qdYmyV" values={{ reference }} />
        </Text>
        {contributionId && (
          <Text>
            <FormattedMessage defaultMessage="Contribution #{id}" id="Siv4wU" values={{ id: contributionId }} />
          </Text>
        )}
      </View>
    );
  }

  getTaxTotal() {
    const getTaxAmountInHostCurrency = t => Math.abs(t.taxAmount?.valueInCents) * (t.hostCurrencyFxRate || 1);
    return Math.round(sumBy(this.props.receipt.transactions, t => getTaxAmountInHostCurrency(t) || 0));
  }

  /** Returns the VAT number of the collective */
  renderBillToTaxIdNumbers() {
    const { fromAccount, fromAccountHost, transactions } = this.props.receipt;
    const taxesSummary = getTaxIdNumbersFromTransactions(transactions);

    // Expenses rely solely on the tax info stored in transactions. For orders, we look in the fromCollective
    if (!transactions.every(t => t.kind === 'EXPENSE')) {
      const getVatNumberFromAccount = (a: { settings?: { VAT?: { number?: string } } } | undefined | null) =>
        a?.settings?.VAT?.number;
      if (getVatNumberFromAccount(fromAccount)) {
        taxesSummary.push({ type: 'VAT', idNumber: getVatNumberFromAccount(fromAccount) });
      } else if (getVatNumberFromAccount(fromAccountHost)) {
        taxesSummary.push({ type: 'VAT', idNumber: getVatNumberFromAccount(fromAccountHost) });
      }
    }

    const uniqTaxInfo = uniqBy(taxesSummary, s => `${s.type}-${s.idNumber}`);
    if (uniqTaxInfo.length) {
      return uniqTaxInfo.map(({ idNumber, type }) => (
        <Text key={`${type}-${idNumber}`}>
          {type}: {idNumber}
        </Text>
      ));
    }

    return null;
  }

  /** Get a description for transaction, with a mention to gift card emitter if necessary */
  transactionDescription(transaction: Props['receipt']['transactions'][0]) {
    const targetCollective = getTransactionReceiver(transaction as unknown as Transaction);
    const transactionDescription = transaction.description || targetCollective.name || targetCollective.slug;

    return !transaction.giftCardEmitterAccount ? (
      <Text>{transactionDescription}</Text>
    ) : (
      <React.Fragment>
        <Image src="./public/static/images/giftcard.png" style={styles.giftCardImage} />
        <Text>{transactionDescription}</Text>
      </React.Fragment>
    );
  }

  getTaxColumnHeader(transactions: Props['receipt']['transactions']) {
    const taxInfoList = transactions.map(getTaxInfoFromTransaction).filter(Boolean);
    const taxTypes = uniqBy(taxInfoList, t => t.type);
    return taxTypes.length !== 1 ? <FormattedMessage defaultMessage="Tax" id="AwzkSM" /> : taxTypes[0].type;
  }

  renderTransactionsTable(transactions: Props['receipt']['transactions']) {
    return (
      <Table>
        <TH style={styles.tableHeader}>
          <TD style={[styles.tableCell]} weighting={TableWeighting.date}>
            <Text>
              <FormattedMessage id="P7PLVj" defaultMessage="Date" />
            </Text>
          </TD>
          <TD style={styles.tableCell} weighting={TableWeighting.descripion}>
            <Text>
              <FormattedMessage id="Q8Qw5B" defaultMessage="Description" />
            </Text>
          </TD>
          <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.quantity}>
            <Text>
              <FormattedMessage id="B6cXQW" defaultMessage="QTY" />
            </Text>
          </TD>
          <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.unitPrice}>
            <Text>
              <FormattedMessage id="qMynRr" defaultMessage="Unit Price" />
            </Text>
          </TD>
          <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.tax}>
            <Text>{this.getTaxColumnHeader(transactions)}</Text>
          </TD>
          <TD style={[styles.tableCell, styles.tableCellRight]} weighting={TableWeighting.netAmount}>
            <Text>
              <FormattedMessage id="FxUka3" defaultMessage="Net Amount" />
            </Text>
          </TD>
        </TH>

        {transactions.map(transaction => {
          const quantity = get(transaction, 'order.quantity') || 1;
          const amountInHostCurrency = transaction.amountInHostCurrency.valueInCents;
          const taxAmount = Math.abs(transaction.taxAmount?.valueInCents || 0);
          const hostCurrencyFxRate = transaction.hostCurrencyFxRate || 1;
          const taxAmountInHostCurrency = taxAmount * hostCurrencyFxRate;
          const grossPriceInHostCurrency =
            amountInHostCurrency - (transaction.isRefund ? -taxAmountInHostCurrency : taxAmountInHostCurrency);
          const unitGrossPriceInHostCurrency = Math.abs(grossPriceInHostCurrency / quantity);
          const transactionCurrency = (transaction.hostCurrency as string) || this.props.receipt.currency;
          const isRefunded = !transaction.isRefund && transaction.refundTransaction;

          return (
            <TR key={transaction.id}>
              <TD style={styles.tableCell} weighting={TableWeighting.date}>
                <Text>
                  <CustomIntlDate date={new Date(transaction.createdAt)} />
                </Text>
              </TD>
              <TD style={styles.tableCell} weighting={TableWeighting.descripion}>
                <View>
                  {isRefunded && (
                    <Text style={styles.refundTag}>
                      <FormattedMessage defaultMessage="REFUNDED" id="xoZxx7" />
                    </Text>
                  )}
                  <View style={styles.descriptionContainer}>{this.transactionDescription(transaction)}</View>
                </View>
              </TD>
              <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.quantity}>
                <Text>{quantity}</Text>
              </TD>
              <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.unitPrice}>
                <View>
                  <Text>{formatCurrency(unitGrossPriceInHostCurrency, transactionCurrency)}</Text>
                  {transaction.amountInHostCurrency.currency !== transaction.amount.currency && (
                    <Text style={styles.taxInfo}>
                      (
                      {formatCurrency(
                        (transaction.amount.valueInCents - taxAmount) / quantity,
                        transaction.amount.currency,
                      )}
                      &nbsp;x&nbsp;
                      {round(transaction.hostCurrencyFxRate, 4)}%)
                    </Text>
                  )}
                </View>
              </TD>
              <TD style={[styles.tableCell, styles.tableCellCenter]} weighting={TableWeighting.tax}>
                <Text>{isNil(transaction.taxAmount) ? '-' : `${getTransactionTaxPercent(transaction)}%`}</Text>
              </TD>
              <TD style={[styles.tableCell, styles.tableCellRight]} weighting={TableWeighting.netAmount}>
                <Text>{formatCurrency(amountInHostCurrency, transactionCurrency)}</Text>
              </TD>
            </TR>
          );
        })}
      </Table>
    );
  }

  shouldDisplayReverseVATWarning() {
    const { host, fromAccount, transactions } = this.props.receipt;
    const hostCountry = host.location?.country;
    const fromAccountCountry = fromAccount.location?.country;
    if (isNil(fromAccountCountry) || hostCountry !== 'US' || !isMemberOfTheEuropeanUnion(fromAccountCountry)) {
      return false;
    }

    return transactions.some(t => ['PRODUCT', 'SERVICE'].includes(get(t, 'order.tier.type') as string));
  }

  render() {
    const { receipt } = this.props;

    if (!receipt) {
      return (
        <Document>
          <Page style={styles.page}>
            <Text>No receipt to render</Text>
          </Page>
        </Document>
      );
    }
    const { transactions } = receipt;
    if (!transactions || transactions.length === 0) {
      return (
        <Document>
          <Page style={styles.page}>
            <Text>No transaction to render</Text>
          </Page>
        </Document>
      );
    }

    const chunkedTransactions = this.chunkTransactions(receipt, transactions);
    const taxesTotal = this.getTaxTotal();
    const billTo = this.getBillTo();
    const isSingleTransaction = transactions.length === 1;
    const isTicketOrder = isSingleTransaction && get(transactions[0], 'order.tier.type') === 'TICKET';
    let qrImage: Promise<string> | undefined;

    try {
      if (isTicketOrder) {
        // Using await inside try/catch to handle the Promise
        qrImage = QRCode.toDataURL(getTransactionUrl(receipt.transactions[0] as unknown as Transaction), {
          margin: 0,
          width: 72,
          color: {
            dark: '#313233',
          },
        });
      }
    } catch (e) {
      console.error('Failed to generate QR code', e);
    }

    return (
      <Document>
        {this.props.debug && (
          <Page size="A4" style={styles.page}>
            <View style={styles.debugPanel}>
              <Text style={styles.bold}>Dimensions</Text>
              <Text style={styles.bold}>Receipt</Text>
              <Text>{JSON.stringify(this.props.receipt, null, 2)}</Text>
            </View>
          </Page>
        )}

        {chunkedTransactions.map((transactionsChunk, pageNumber) => (
          <Page key={pageNumber} size="A4" style={styles.page}>
            {pageNumber === 0 && (
              <View style={styles.header}>
                <View style={[styles.flexRow, styles.flexWrap, styles.alignStart]}>
                  <View style={[styles.flexGrow, styles.mb3]}>
                    <Link src={`https://opencollective.com/${receipt.host.slug}`} style={styles.link}>
                      <Text style={styles.accountName}>
                        {receipt.host.legalName || receipt.host.name || receipt.host.slug}
                      </Text>
                    </Link>
                    <View style={styles.my2}>
                      <LocationParagraph collective={receipt.host as Account} />
                    </View>
                    <Link src={`https://opencollective.com/${receipt.host.slug}`} style={styles.link}>
                      https://opencollective.com/{receipt.host.slug}
                    </Link>
                  </View>

                  <View style={[styles.mt20, styles.pr3, styles.minHeight100]}>
                    <Text style={styles.billTo}>
                      {receipt.isRefundOnly ? (
                        <FormattedMessage id="BMuEYE" defaultMessage="Refund to" />
                      ) : (
                        <FormattedMessage id="gSv0eP" defaultMessage="Bill to" />
                      )}
                    </Text>
                    <View style={styles.my2}>
                      <Text>{billTo.legalName || billTo.name || billTo.slug}</Text>
                      <LocationParagraph collective={billTo as Account} />
                      {this.renderBillToTaxIdNumbers()}
                    </View>
                  </View>
                </View>

                <View style={[styles.flexRow, styles.justifyBetween]}>
                  <View>
                    <Text style={styles.receiptTitle}>
                      {receipt.template?.title ||
                        (receipt.isRefundOnly ? (
                          <FormattedMessage defaultMessage="Payment refund" id="avT1MX" />
                        ) : (
                          <FormattedMessage id="xl9qBU" defaultMessage="Payment Receipt" />
                        ))}
                    </Text>

                    {receipt.dateFrom && (
                      <Text style={styles.dateInfo}>
                        <CustomIntlDate date={new Date(receipt.dateFrom)} />
                      </Text>
                    )}

                    {receipt.dateTo && (
                      <Text style={styles.dateInfo}>
                        To: <CustomIntlDate date={new Date(receipt.dateTo)} />
                      </Text>
                    )}

                    <View style={styles.mt3}>{this.getReceiptReference()}</View>

                    {transactions.length === 1 && transactions[0].paymentMethod && (
                      <Text style={styles.paymentMethod}>
                        <FormattedMessage defaultMessage="Payment Method" id="nFQbxh" />:{' '}
                        {formatPaymentMethodName(transactions[0].paymentMethod as unknown as PaymentMethod)}
                      </Text>
                    )}
                  </View>

                  {qrImage && <Image src={qrImage} style={styles.qrCode} />}
                </View>
              </View>
            )}

            {Boolean(isTicketOrder && receipt.transactions[0].toAccount?.type === 'EVENT') && (
              <Text style={styles.eventDescription}>
                <EventDescription event={receipt.transactions[0].toAccount as Event} />
              </Text>
            )}

            <View>
              {this.renderTransactionsTable(transactionsChunk)}

              {pageNumber === chunkedTransactions.length - 1 && (
                <View style={[styles.flexRow, styles.justifyEnd, styles.mt3]}>
                  <View style={styles.totalsContainer}>
                    <View style={styles.borderBottom} />

                    {Boolean(taxesTotal) && (
                      <View style={[styles.minWidth225]}>
                        <View style={styles.totalsRow}>
                          <Text>
                            <FormattedMessage id="L8seEc" defaultMessage="Subtotal" />
                          </Text>
                          <Text style={styles.bold}>
                            {formatCurrency(receipt.totalAmount - taxesTotal, receipt.currency, {
                              showCurrencySymbol: true,
                            })}
                          </Text>
                        </View>

                        {getTaxesBreakdown(this.props.receipt.transactions as unknown as Transaction[]).map(tax => (
                          <View key={tax.id} style={styles.totalsRow}>
                            <Text>
                              {tax.info.type} ({round(tax.info.rate * 100, 2)}%)
                            </Text>
                            <Text style={styles.bold}>
                              {formatCurrency(tax.amountInHostCurrency, receipt.currency, { showCurrencySymbol: true })}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.totalHighlight}>
                      <View style={styles.totalsRow}>
                        <Text style={styles.bold}>
                          <FormattedMessage id="XY/5wo" defaultMessage="TOTAL" />
                        </Text>
                        <Text style={styles.bold}>
                          {formatCurrency(receipt.totalAmount, receipt.currency, { showCurrencySymbol: true })}
                        </Text>
                      </View>
                    </View>

                    {this.shouldDisplayReverseVATWarning() && (
                      <Text style={styles.warningText}>
                        <FormattedMessage
                          id="aqXI+n"
                          defaultMessage="0% VAT. Reverse charge to be applied by recipient."
                        />
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {pageNumber === chunkedTransactions.length - 1 && (
              <React.Fragment>
                {receipt.template?.info && <Text style={styles.footerInfo}>{receipt.template?.info}</Text>}
                {receipt.template?.embeddedImage && (
                  <Image src={receipt.template.embeddedImage} style={styles.embeddedImage} />
                )}
                <View style={styles.flexGrow}></View>
                <CollectiveFooter collective={receipt.host as Account} />
              </React.Fragment>
            )}
          </Page>
        ))}
      </Document>
    );
  }
}

export default Receipt;
