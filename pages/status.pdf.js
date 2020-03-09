import React from 'react';
import StatusPage from './status';
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
        <StatusPage />
      </PDFLayout>
    );
  }
}

export default PdfStatusPage;
