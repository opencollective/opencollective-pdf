import React from 'react';
import PropTypes from 'prop-types';
import PDFLayout from '../../../../../../../components/PDFLayout';
import PageFormat from '../../../../../../../lib/constants/page-format';
import { getAccessTokenFromReq } from '../../../../../../../lib/req-utils';
import { fetchInvoiceByDateRange } from '../../../../../../../lib/graphql/queries';
import { ReceiptV2 } from '../../../../../../../components/ReceiptV2';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { fromCollectiveSlug, toCollectiveSlug: hostSlug, isoStartDate: dateFrom, isoEndDate: dateTo } = ctx.query;
      const accessToken = getAccessTokenFromReq(ctx);
      if (!accessToken && !ctx.query.app_key) {
        // Frontend sends an OPTIONS request to check CORS, we should just return OK when that happens
        if (ctx.req.method === 'OPTIONS') {
          return {};
        }

        throw new Error('Please provide an access token or an APP key');
      }

      const queryParams = { fromCollectiveSlug, hostSlug, dateFrom, dateTo };
      const response = await fetchInvoiceByDateRange(queryParams, accessToken, ctx.query.app_key);

      if (response.transactions.totalCount > response.transactions.nodes.length) {
        throw new Error('Too many transactions. Please contact support');
      }
      const invoiceTemplateObj = await response?.host?.settings?.invoice?.templates?.[
        response.transactions[0]?.invoiceTemplate || response.transactions[0]?.order?.tier?.data?.invoiceTemplate
      ];
      const template = invoiceTemplateObj || response.host?.settings?.invoice?.templates?.default;

      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          currency: response.host.currency,
          totalAmount: response.transactions.nodes.reduce((total, t) => total + t.amountInHostCurrency.valueInCents, 0),
          transactions: response.transactions.nodes,
          host: response.host,
          fromAccount: response.fromAccount,
          dateFrom,
          dateTo,
          template,
        },
      };
    }

    return { pageFormat: ctx.query.pageFormat };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <ReceiptV2 receipt={this.props.receipt} />
      </PDFLayout>
    );
  }
}

TransactionReceipt.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  receipt: PropTypes.object,
};

export default TransactionReceipt;
