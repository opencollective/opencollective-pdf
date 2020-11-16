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
      const receipt = await fetchTransactionInvoice(uuid, accessToken, ctx.query.app_key);
      return {
        pageFormat: ctx.query.pageFormat,
        receipt: {
          ...receipt,
          totalAmount: getTransactionAmount(receipt.transactions[0]),
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
