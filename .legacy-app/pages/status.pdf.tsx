import React from 'react';
import PDFLayout from '../components/PDFLayout';
import type { PageFormatKey } from '../lib/constants/page-format';

/**
 * Return the status of the invoice server
 */

class PdfStatusPage extends React.Component<{ pageFormat: PageFormatKey }> {
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

export default PdfStatusPage;
