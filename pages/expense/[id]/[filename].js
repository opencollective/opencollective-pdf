import PropTypes from 'prop-types';
import React from 'react';
import ExpenseInvoice from '../../../components/ExpenseInvoice';
import PDFLayout from '../../../components/PDFLayout';
import PageFormat from '../../../lib/constants/page-format';
import { fetchExpenseInvoiceData } from '../../../lib/graphql/queries';
import { getAccessTokenFromReq } from '../../../lib/req-utils';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { id } = ctx.query;
      const accessToken = getAccessTokenFromReq(ctx);
      const expense = await fetchExpenseInvoiceData(id, accessToken, ctx.query.app_key);
      return { expense, pageFormat: ctx.query.pageFormat };
    }

    return { pageFormat: ctx.query.pageFormat };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <ExpenseInvoice expense={this.props.expense} pageFormat={this.props.pageFormat} />
      </PDFLayout>
    );
  }
}

TransactionReceipt.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  expense: PropTypes.object,
};

export default TransactionReceipt;
