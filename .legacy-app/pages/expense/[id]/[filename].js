import PropTypes from 'prop-types';
import React from 'react';
import ExpenseInvoice from '../../../components/ExpenseInvoice';
import PDFLayout from '../../../components/PDFLayout';
import PageFormat from '../../../lib/constants/page-format';
import { fetchExpenseInvoiceData } from '../../../lib/graphql/queries';
import { authenticateRequest } from '../../../lib/req-utils';
import { ForbiddenError, NotFoundError } from '../../../lib/errors';

class TransactionReceipt extends React.Component {
  static async getInitialProps(ctx) {
    const isServer = Boolean(ctx.req);
    if (isServer) {
      const { id } = ctx.query;
      const authorizationHeaders = authenticateRequest(ctx);
      if (!authorizationHeaders) {
        return {};
      }

      const expense = await fetchExpenseInvoiceData(id, authorizationHeaders);
      if (!expense) {
        throw new NotFoundError(`Expense ${id} not found`);
      } else if (!expense.permissions.canSeeInvoiceInfo) {
        throw new ForbiddenError(`You don't have permission to see this expense's invoice info`);
      } else {
        return { expense, pageFormat: ctx.query.pageFormat };
      }
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
