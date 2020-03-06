import React from 'react';
import PropTypes from 'prop-types';
import PageFormat from '../lib/constants/page-format';
import PDFLayout from '../components/PDFLayout';

/**
 * Return the status of the invoice server
 */

class PdfStatusPage extends React.Component {
  static async getInitialProps({ query }) {
    return { pageFormat: query.pageFormat };
  }

  render() {
    return (
      <PDFLayout pageFormat={this.props.pageFormat}>
        <div style={{ padding: 32, fontSize: 26 }}>All Systems Operational ✔️</div>
      </PDFLayout>
    );
  }
}

PdfStatusPage.propTypes = {
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
};

export default PdfStatusPage;
