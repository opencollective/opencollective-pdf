import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import PageFormat from '../../lib/constants/page-format';
import { Receipt } from '../../components/Receipt';
import PDFLayout from '../../components/PDFLayout';

const FIXTURES = {
  'donation-receipt': require('../../lib/fixtures/donation-receipt.json'),
  'organization-gift-cards-monthly': require('../../lib/fixtures/organization-gift-cards-monthly.json'),
  'organization-gift-cards-yearly': require('../../lib/fixtures/organization-gift-cards-yearly.json'),
  'simple-transaction': require('../../lib/fixtures/simple-transaction.json'),
  'transactions-with-date-range': require('../../lib/fixtures/transactions-with-date-range.json'),
  'transactions-with-tax': require('../../lib/fixtures/transactions-with-tax.json'),
};

class FixturePage extends React.Component {
  static async getInitialProps({ req, query }) {
    const isServer = Boolean(req);
    if (isServer) {
      const { name } = path.parse(query.fixture);
      const receipt = FIXTURES[name];
      if (!receipt) {
        throw new Error("This fixture doesn't exist");
      }
      return { receipt, pageFormat: query.pageFormat };
    }

    return { pageFormat: query.pageFormat };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <Receipt invoice={this.props.receipt} />
      </PDFLayout>
    );
  }
}

FixturePage.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
  receipt: PropTypes.object,
};

export default FixturePage;
