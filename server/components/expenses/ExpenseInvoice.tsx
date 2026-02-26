import React from 'react';
import { Document, Page, Text, View, Link, Styles, StyleSheet } from '@react-pdf/renderer';
import { chunk, get, max, round, sumBy } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import { formatCurrency } from '../../lib/currency.js';
import { getCurrencyPrecision } from '../../lib/currency.js';
import ExpenseItemsTable from './ExpenseItemsTable.js';
import { QueryResult } from '@apollo/client/index.js';
import { AccountWithHost, ExpenseInvoiceQuery } from '../../../server/graphql/types/v2/graphql.js';
import { Account } from '../../../server/graphql/types/v2/graphql.js';
import { FontFamily } from '../../../server/lib/pdf.js';
import dayjs from 'dayjs';

type ExpenseFromQuery = NonNullable<NonNullable<QueryResult<ExpenseInvoiceQuery>['data']>['expense']>;

const styles: Styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: FontFamily.InterRegular,
    fontSize: 10,
    color: '#2C3135',
  },
  header: {
    marginBottom: 20,
  },
  headerRow: {
    marginBottom: 20,
  },
  fromAddressBlock: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  toAddressBlock: {
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  addressTitle: {
    fontSize: 12,
    fontFamily: FontFamily.InterBold,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 10,
    color: '#333333',
  },
  expenseLink: {
    fontSize: 12,
    fontFamily: FontFamily.InterBold,
    marginBottom: 5,
    textDecoration: 'underline',
    color: '#000000',
  },
  expenseDetails: {
    marginTop: 20,
    marginBottom: 20,
  },
  expenseTitle: {
    fontSize: 12,
    fontFamily: FontFamily.InterBold,
    marginBottom: 5,
    textDecoration: 'underline',
    color: '#000000',
  },
  expenseInfo: {
    fontSize: 10,
    color: '#333333',
  },
  totalsContainer: {
    width: '50%',
    alignSelf: 'flex-end',
    fontSize: 9,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 20,
    borderRadius: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  totalRowHighlight: {
    backgroundColor: '#EBF4FF',
  },
  totalLabel: {
    fontFamily: FontFamily.InterBold,
  },
  totalAmount: {
    fontFamily: FontFamily.InterBold,
  },
  invoiceInfo: {
    fontFamily: FontFamily.InterItalic,
    marginTop: 40,
    fontSize: 10,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
});

const getItemAmounts = (item: ExpenseFromQuery['items'][number]) => {
  if (!item.amountV2.exchangeRate) {
    return { inItemCurrency: item.amountV2, inExpenseCurrency: item.amountV2 };
  } else {
    return {
      inItemCurrency: item.amountV2,
      inExpenseCurrency: {
        currency: item.amountV2.exchangeRate.toCurrency,
        valueInCents: round(
          (item.amountV2.valueInCents as NonNullable<number>) * item.amountV2.exchangeRate.value,
          getCurrencyPrecision(item.amountV2.exchangeRate.toCurrency),
        ),
      },
    };
  }
};

const sumItemsInExpenseCurrency = (items: ExpenseFromQuery['items']) => {
  return sumBy(items, item => getItemAmounts(item).inExpenseCurrency.valueInCents as NonNullable<number>);
};

const chunkItems = (expense: ExpenseFromQuery, billToAccount: Pick<Account, 'location'>) => {
  const baseNbOnFirstPage = 12;
  const minNbOnFirstPage = 8;
  const itemsPerPage = 22;

  // Estimate the space available
  const countLines = (str?: string | null): number => (str ? sumBy(str, c => (c === '\n' ? 1 : 0)) : 0);
  const billFromAddressSize = countLines(get(expense.payeeLocation, 'address'));
  const billToAddressSize = countLines(
    get(billToAccount, 'location.address') || get(billToAccount, 'host.location.address'),
  );
  const maxNbOnFirstPage =
    max([minNbOnFirstPage, baseNbOnFirstPage - (billFromAddressSize + billToAddressSize)]) || minNbOnFirstPage;

  // If we don't need to put the logo on first page then let's use all the space available
  const items = expense.items;
  const nbOnFirstPage = items.length > baseNbOnFirstPage ? baseNbOnFirstPage : maxNbOnFirstPage;

  return [items.slice(0, nbOnFirstPage), ...chunk(items.slice(nbOnFirstPage), itemsPerPage)];
};

const getBillTo = (expense: ExpenseFromQuery) => {
  const billToType = get(expense, 'account.host.settings.invoice.expenseTemplates.default.billTo', 'host');
  if (billToType === 'collective') {
    return expense.account;
  } else {
    return (expense.account as unknown as AccountWithHost).host || expense.account;
  }
};

const ExpenseInvoice = ({
  expense,
}: {
  expense: NonNullable<NonNullable<QueryResult<ExpenseInvoiceQuery>['data']>['expense']>;
}) => {
  const { account, payee, payeeLocation } = expense;
  const billToAccount = getBillTo(expense);
  const chunkedItems = chunkItems(expense, billToAccount);
  const grossAmount = sumItemsInExpenseCurrency(expense.items);

  return (
    <Document>
      {chunkedItems.map((itemsChunk, pageNumber) => (
        <Page key={pageNumber} style={styles.page}>
          {pageNumber === 0 && (
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <View style={styles.fromAddressBlock}>
                  <Text style={styles.addressTitle}>
                    <FormattedMessage id="dM+p3/" defaultMessage="From" />
                  </Text>
                  <Text style={styles.addressText}>{payee.legalName || payee.name || payee.slug}</Text>
                  {payeeLocation?.address && <Text style={styles.addressText}>{payeeLocation.address}</Text>}
                  {payeeLocation?.country && <Text style={styles.addressText}>{payeeLocation.country}</Text>}
                </View>

                <View style={styles.toAddressBlock}>
                  <Text style={styles.addressTitle}>
                    <FormattedMessage id="gSv0eP" defaultMessage="Bill to" />
                  </Text>
                  <Text style={styles.addressText}>
                    {billToAccount.legalName || billToAccount.name || billToAccount.slug}
                  </Text>
                  {billToAccount.location?.address && (
                    <Text style={styles.addressText}>{billToAccount.location.address}</Text>
                  )}
                  {billToAccount.location?.country && (
                    <Text style={styles.addressText}>{billToAccount.location.country}</Text>
                  )}
                </View>
              </View>

              <View style={styles.expenseDetails}>
                <Link
                  src={`${process.env.WEBSITE_URL}/${expense.account.slug}/expenses/${expense.legacyId}`}
                  style={styles.expenseLink}
                >
                  <FormattedMessage
                    id="GGuO8S"
                    defaultMessage="Expense #{id}: {description}"
                    values={{
                      id: expense.legacyId,
                      description: expense.description,
                    }}
                  />
                </Link>
                {expense.reference && (
                  <Text style={styles.expenseInfo}>
                    <FormattedMessage
                      id="qdYmyV"
                      defaultMessage="Reference: {reference}"
                      values={{ reference: expense.reference }}
                    />
                  </Text>
                )}
                <Text style={styles.expenseInfo}>
                  <FormattedMessage
                    id="AJ6aIN"
                    defaultMessage="Collective: {collectiveName}"
                    values={{ collectiveName: account.legalName || account.name || account.slug }}
                  />
                </Text>
                <Text style={styles.expenseInfo}>
                  <FormattedMessage
                    defaultMessage="Date: {date}"
                    id="IeqnaT"
                    values={{ date: dayjs(expense.createdAt).format('YYYY-MM-DD') }}
                  />
                </Text>
              </View>
            </View>
          )}

          <ExpenseItemsTable expense={{ ...expense, taxes: expense.taxes || [] }} items={itemsChunk} />

          {pageNumber === chunkedItems.length - 1 && (
            <View>
              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text>
                    <FormattedMessage id="L8seEc" defaultMessage="Subtotal" />
                  </Text>
                  <Text>
                    {formatCurrency(grossAmount, expense.currency, {
                      showCurrencySymbol: true,
                    })}
                  </Text>
                </View>

                {expense.taxes?.map(tax => (
                  <View key={tax.id} style={styles.totalRow}>
                    <Text style={styles.totalLabel}>
                      {tax.type} ({round(tax.rate * 100, 2)}%)
                    </Text>
                    <Text style={styles.totalAmount}>
                      {formatCurrency(tax.rate * grossAmount, expense.currency, {
                        showCurrencySymbol: true,
                      })}
                    </Text>
                  </View>
                ))}

                <View style={[styles.totalRow, styles.totalRowHighlight]}>
                  <Text style={[styles.totalLabel]}>
                    <FormattedMessage id="MJ2jZQ" defaultMessage="Total" />
                  </Text>
                  <Text style={styles.totalAmount}>
                    {formatCurrency(expense.amount, expense.currency, {
                      showCurrencySymbol: true,
                    })}
                  </Text>
                </View>
              </View>

              {expense.invoiceInfo && <Text style={styles.invoiceInfo}>{expense.invoiceInfo}</Text>}
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default ExpenseInvoice;
