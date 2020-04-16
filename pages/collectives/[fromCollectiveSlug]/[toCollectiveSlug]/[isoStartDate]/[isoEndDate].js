import React from 'react';
import PropTypes from 'prop-types';
import PDFLayout from '../../../../../components/PDFLayout';
import { Receipt } from '../../../../../components/Receipt';
import PageFormat from '../../../../../lib/constants/page-format';
import { getAccessTokenFromReq } from '../../../../../lib/req-utils';
import { fetchInvoiceByDateRange } from '../../../../../lib/graphql/queries';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { fromCollectiveSlug, toCollectiveSlug: collectiveSlug, isoStartDate: dateFrom, isoEndDate } = ctx.query;
      const dateTo = isoEndDate.split('.')[0]; // isoEndDate can include file extension
      const accessToken = getAccessTokenFromReq(ctx);
      const queryParams = { fromCollectiveSlug, collectiveSlug, dateFrom, dateTo };
      const receipt = await fetchInvoiceByDateRange(queryParams, accessToken, ctx.query.app_key);
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

TransactionReceipt.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  receipt: PropTypes.object,
};

export default TransactionReceipt;
