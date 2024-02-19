import React from 'react';
import PropTypes from 'prop-types';
import PDFLayout from '../../../../../../../components/PDFLayout';
import PageFormat from '../../../../../../../lib/constants/page-format';
import { authenticateRequest } from '../../../../../../../lib/req-utils';
import { fetchInvoiceByDateRange } from '../../../../../../../lib/graphql/queries';
import { Receipt } from '../../../../../../../components/Receipt';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { fromCollectiveSlug, toCollectiveSlug: hostSlug, isoStartDate: dateFrom, isoEndDate: dateTo } = ctx.query;
      const authorizationHeaders = authenticateRequest(ctx.req);
      if (!authorizationHeaders) {
        return {};
      }

      const queryParams = { fromCollectiveSlug, hostSlug, dateFrom, dateTo };
      const response = await fetchInvoiceByDateRange(queryParams, authorizationHeaders);

      if (response.transactions.totalCount > response.transactions.nodes.length) {
        throw new Error('Too many transactions. Please contact support');
      }
      const invoiceTemplateObj =
        await response.host?.settings?.invoice?.templates?.[
          response.transactions[0]?.invoiceTemplate || response.transactions[0]?.order?.tier?.invoiceTemplate
        ];
      const template = invoiceTemplateObj || response.host.settings?.invoice?.templates?.default;

      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          currency: response.host.currency,
          totalAmount: response.transactions.nodes.reduce((total, t) => total + t.amountInHostCurrency.valueInCents, 0),
          transactions: response.transactions.nodes,
          host: response.host,
          fromAccount: response.fromAccount,
          fromAccountHost: response.fromAccount.host,
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
