import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { round, sumBy, uniq } from 'lodash-es';
import { getCurrencyPrecision } from '../../utils/currency';
import { formatAmount } from '../../utils/currency';
import { formatCurrency } from '../../utils/currency';
import { FontFamily } from '../../utils/pdf';

type AmountV2 = {
  valueInCents: number;
  currency: string;
  exchangeRate?: {
    value: number;
    toCurrency: string;
  };
};

type ExpenseItem = {
  id: string;
  description?: string;
  incurredAt: string;
  amountV2: AmountV2;
};

type Tax = {
  type: string;
  rate: number;
};

type ExpenseItemsTableProps = {
  expense: {
    taxes: Tax[];
  };
  items: ExpenseItem[];
};

const getItemAmounts = (item: ExpenseItem) => {
  if (!item.amountV2.exchangeRate) {
    return { inItemCurrency: item.amountV2, inExpenseCurrency: item.amountV2 };
  } else {
    return {
      inItemCurrency: item.amountV2,
      inExpenseCurrency: {
        currency: item.amountV2.exchangeRate.toCurrency,
        valueInCents: round(
          item.amountV2.valueInCents * item.amountV2.exchangeRate.value,
          getCurrencyPrecision(item.amountV2.exchangeRate.toCurrency),
        ),
      },
    };
  }
};

const styles = StyleSheet.create({
  header: {
    fontFamily: FontFamily.InterBold,
    fontWeight: 'bold',
    backgroundColor: '#F0F0F0',
  },
  cell: {
    fontFamily: FontFamily.InterRegular,
    fontSize: 9,
    padding: 5,
    borderColor: '#D0D0D0',
  },
});

const ExpenseItemsTable: React.FC<ExpenseItemsTableProps> = ({ items, expense }) => {
  const allTaxTypes = uniq(expense.taxes.map(tax => tax.type));
  const taxType = allTaxTypes.length === 1 ? allTaxTypes[0] : 'Tax';
  const taxRate = sumBy(expense.taxes, 'rate') || 0;

  return (
    <Table>
      <TH style={styles.header}>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="date" defaultMessage="Date" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="description" defaultMessage="Description" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="grossAmount" defaultMessage="Gross amount" />
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            {taxType} {Boolean(taxRate) && `(${round(taxRate * 100, 2)}%)`}
          </Text>
        </TD>
        <TD style={styles.cell}>
          <Text>
            <FormattedMessage id="netAmount" defaultMessage="Net Amount" />
          </Text>
        </TD>
      </TH>
      {items.map(item => {
        const amounts = getItemAmounts(item);
        return (
          <TR key={item.id}>
            <TD style={styles.cell}>
              <Text>
                <FormattedDate value={new Date(item.incurredAt)} day="2-digit" month="2-digit" year="numeric" />
              </Text>
            </TD>
            <TD style={styles.cell}>
              <Text>
                {item.description || <FormattedMessage id="NoDescription" defaultMessage="No description provided" />}
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
                {formatCurrency(amounts.inExpenseCurrency.valueInCents * taxRate, amounts.inExpenseCurrency.currency)}
              </Text>
            </TD>
            <TD style={styles.cell}>
              <Text>
                {formatCurrency(
                  amounts.inExpenseCurrency.valueInCents * (1 + taxRate),
                  amounts.inExpenseCurrency.currency,
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
