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
      const { fromCollectiveSlug, toCollectiveSlug: hostSlug, isoStartDate: dateFrom, isoEndDate } = ctx.query;
      const dateTo = isoEndDate.split('.')[0]; // isoEndDate can include file extension
      const accessToken = getAccessTokenFromReq(ctx);
      const queryParams = { fromCollectiveSlug, hostSlug, dateFrom, dateTo };
      const response = await fetchInvoiceByDateRange(queryParams, accessToken, ctx.query.app_key);

      if (response.transactions.totalCount > response.transactions.nodes.length) {
        throw new Error('Too many transactions. Please contact support');
      }

      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          title: response.host.settings?.invoiceTitle,
          extraInfo: response.host.settings?.invoice?.extraInfo,
          currency: response.host.currency,
          totalAmount: response.transactions.nodes.reduce((total, t) => total + t.amountInHostCurrency.valueInCents, 0),
          transactions: response.transactions.nodes,
          host: response.host,
          fromAccount: response.fromAccount,
          dateFrom,
          dateTo,
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
