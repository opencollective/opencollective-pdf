import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { FormattedMessage } from 'react-intl';
import { round, sumBy, uniq } from 'lodash-es';
import { getCurrencyPrecision } from '../../lib/currency.js';
import { formatAmount } from '../../lib/currency.js';
import { formatCurrency } from '../../lib/currency.js';
import { FontFamily } from '../../lib/pdf.js';
import { Expense, ExpenseItem } from '../../../server/graphql/types/v2/graphql.js';
import dayjs from 'dayjs';

const getItemAmounts = (item: Pick<ExpenseItem, 'id' | 'description' | 'incurredAt' | 'amountV2'>) => {
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

const styles = StyleSheet.create({
  header: {
    fontFamily: FontFamily.InterBold,
    backgroundColor: '#EBF4FF',
  },
  cell: {
    fontSize: 9,
    padding: 5,
    borderColor: '#E0E0E0',
  },
});

const ExpenseItemsTable = ({
  items,
  expense,
}: {
  items: Pick<ExpenseItem, 'id' | 'description' | 'incurredAt' | 'amountV2'>[];
  expense: { taxes: NonNullable<Array<Pick<Expense['taxes'][number], 'type' | 'rate'>>> };
}) => {
  const allTaxTypes = uniq(expense.taxes.map(tax => tax.type));
  const taxType = allTaxTypes.length === 1 ? allTaxTypes[0] : 'Tax';
  const taxRate = sumBy(expense.taxes, 'rate') || 0;

  return (
    <Table>
      <TH style={styles.header}>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="P7PLVj" defaultMessage="Date" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="Q8Qw5B" defaultMessage="Description" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="nDMBYb" defaultMessage="Gross amount" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            {taxType} {Boolean(taxRate) && `(${round(taxRate * 100, 2)}%)`}
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="FxUka3" defaultMessage="Net Amount" />
          </Text>
        </TD>
      </TH>
      {items.map(item => {
        const amounts = getItemAmounts(item);
        return (
          <TR key={item.id}>
            <TD style={styles.cell}>
              <Text>{dayjs(item.incurredAt).format('YYYY-MM-DD')}</Text>
            </TD>
            <TD style={styles.cell}>
              <Text>
                {item.description || <FormattedMessage id="TOxNpA" defaultMessage="No description provided" />}
              </Text>
            </TD>
            <TD style={styles.cell}>
              {!amounts.inItemCurrency.exchangeRate ? (
                <Text>
                  {formatAmount(amounts.inItemCurrency, {
                    showCurrencySymbol: true,
                  })}
                </Text>
              ) : (
                <View>
                  <Text>
                    {formatAmount(amounts.inExpenseCurrency, {
                      showCurrencySymbol: true,
                    })}
                  </Text>
                  <Text>
                    (
                    {formatAmount(amounts.inItemCurrency, {
                      showCurrencySymbol: true,
                    })}
                    {' * '}
                    {amounts.inItemCurrency.exchangeRate.value})
                  </Text>
                </View>
              )}
            </TD>
            <TD style={styles.cell}>
              <Text>
                {formatCurrency(
                  (amounts.inExpenseCurrency.valueInCents as NonNullable<number>) * taxRate,
                  amounts.inExpenseCurrency.currency as NonNullable<string>,
                )}
              </Text>
            </TD>
            <TD style={styles.cell}>
              <Text>
                {formatCurrency(
                  (amounts.inExpenseCurrency.valueInCents as NonNullable<number>) * (1 + taxRate),
                  amounts.inExpenseCurrency.currency as NonNullable<string>,
                )}
              </Text>
            </TD>
          </TR>
        );
      })}
    </Table>
  );
};

export default ExpenseItemsTable;
