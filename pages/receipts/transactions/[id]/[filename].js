import PropTypes from 'prop-types';
import React from 'react';
import PDFLayout from '../../../../components/PDFLayout';
import PageFormat from '../../../../lib/constants/page-format';
import { fetchTransactionInvoice } from '../../../../lib/graphql/queries';
import { getAccessTokenFromReq } from '../../../../lib/req-utils';
import { Receipt } from '../../../../components/Receipt';
import { getHostFromTransaction } from '../../../../lib/transactions';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { id } = ctx.query;
      const accessToken = getAccessTokenFromReq(ctx);
      if (!accessToken && !ctx.query.app_key) {
        // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
        if (ctx.req.method === 'OPTIONS') {
          return {};
        }

        throw new Error('Please provide an access token or an APP key');
      }

      let transaction = await fetchTransactionInvoice(id, accessToken, ctx.query.app_key);
      if (transaction.type === 'DEBIT' && transaction.oppositeTransaction) {
        transaction = transaction.oppositeTransaction;
      }

      const invoiceName = transaction.invoiceTemplate || transaction.order?.tier?.invoiceTemplate;
      const host = getHostFromTransaction(transaction);
      if (!host) {
        throw new Error('Could not find host for this transaction');
      }

      const template = host.settings?.invoice?.templates?.[invoiceName] || host?.settings?.invoice?.templates?.default;
      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          currency: host.currency,
          totalAmount: transaction.amountInHostCurrency.valueInCents,
          transactions: [transaction],
          host,
          fromAccount: transaction.fromAccount,
          template,
        },
      };
    }

    return { pageFormat: ctx.query.pageFormat };
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
