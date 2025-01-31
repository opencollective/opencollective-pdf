import PropTypes from 'prop-types';
import React from 'react';
import PDFLayout from '../../../../components/PDFLayout';
import PageFormat from '../../../../lib/constants/page-format';
import { fetchTransactionInvoice } from '../../../../lib/graphql/queries';
import { authenticateRequest } from '../../../../lib/req-utils';
import Receipt from '../../../../components/Receipt';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { id, pageFormat } = ctx.query;
      const authorizationHeaders = authenticateRequest(ctx);
      if (!authorizationHeaders) {
        return {};
      }

      const transaction = await fetchTransactionInvoice(id, authorizationHeaders);
      return {
        pageFormat: pageFormat,
        receipt: TransactionReceipt.getReceiptFromData(transaction),
      };
    }

    return { pageFormat: ctx.query?.pageFormat };
  }

  static getReceiptFromData(originalTransaction) {
    let transaction = originalTransaction;
    if (transaction.type === 'DEBIT' && transaction.oppositeTransaction && !transaction.isRefund) {
      transaction = transaction.oppositeTransaction;
    }

    const host = transaction.host;
    if (!host) {
      throw new Error('Could not find host for this transaction');
    }

    const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate;
    const template = host.settings?.invoice?.templates?.[invoiceName] || host?.settings?.invoice?.templates?.default;
    const fromAccount = transaction.isRefund ? transaction.toAccount : transaction.fromAccount;
    return {
      isRefundOnly: transaction.isRefund,
      currency: transaction.amountInHostCurrency.currency,
      totalAmount: transaction.amountInHostCurrency.valueInCents,
      transactions: [transaction],
      host,
      fromAccount: fromAccount,
      fromAccountHost: fromAccount.host,
      template,
    };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <Receipt receipt={this.props.receipt} />
      </PDFLayout>
    );
  }
}

TransactionReceipt.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  receipt: PropTypes.object,
};

export default TransactionReceipt;
