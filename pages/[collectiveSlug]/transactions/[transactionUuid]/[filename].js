import React from 'react';
import PDFLayout from '../../../../components/PDFLayout';
import { Receipt } from '../../../../components/Receipt';
import { getAccessTokenFromReq } from '../../../../lib/req-utils';
import { fetchTransactionInvoice } from '../../../../lib/graphql';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { collectiveSlug, transactionUuid } = ctx.query;
      const errorMsgIfForbidden = `This endpoint requires authentication. If you ended up on this link directly, please go to https://opencollective.com/${collectiveSlug}/transactions instead to download your receipt.`;
      const accessToken = getAccessTokenFromReq(ctx, errorMsgIfForbidden);
      const receipt = await fetchTransactionInvoice(transactionUuid, accessToken, ctx.query.app_key);
      return { receipt, pageFormat: ctx.query.pageFormat };
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

export default TransactionReceipt;
