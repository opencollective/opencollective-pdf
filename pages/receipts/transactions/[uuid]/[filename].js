import PropTypes from 'prop-types';
import React from 'react';
import PDFLayout from '../../../../components/PDFLayout';
import { Receipt } from '../../../../components/Receipt';
import PageFormat from '../../../../lib/constants/page-format';
import { fetchTransactionInvoice } from '../../../../lib/graphql/queries';
import { getAccessTokenFromReq } from '../../../../lib/req-utils';
import { getTransactionAmount } from '../../../../lib/transactions';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { uuid } = ctx.query;
      const accessToken = getAccessTokenFromReq(ctx);
      if (!accessToken && !ctx.query.app_key) {
        // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
        if (ctx.req.method === 'OPTIONS') {
          return {};
        }

        throw new Error('Please provide an access token or an APP key');
      }

      const receipt = await fetchTransactionInvoice(uuid, accessToken, ctx.query.app_key);
      const invoiceName =
        receipt.transactions[0].invoiceTemplate || receipt.transactions[0].order?.tier?.data?.invoiceTemplate;
      const template =
        receipt.host?.settings?.invoice?.templates?.[invoiceName] ||
        receipt.host?.settings?.invoice?.templates?.default;
      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          ...receipt,
          totalAmount: getTransactionAmount(receipt.transactions[0]),
          currency: receipt.transactions[0].hostCurrency,
          template,
        },
      };
    }

    return { pageFormat: ctx.query.pageFormat };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <Receipt invoice={this.props.receipt} />
      </PDFLayout>
    );
  }
}

TransactionReceipt.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  receipt: PropTypes.object,
};

export default TransactionReceipt;
