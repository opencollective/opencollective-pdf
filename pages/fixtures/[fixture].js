import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs-extra';
import PageFormat from '../../lib/constants/page-format';
import { Receipt } from '../../components/Receipt';
import PDFLayout from '../../components/PDFLayout';

const FIXTURES_PATHS = ['./public/static/fixtures', './static/fixtures'];

const loadFixture = async (fixtureName) => {
  for (const fixturesPath of FIXTURES_PATHS) {
    const filePath = path.join(fixturesPath, `${path.basename(fixtureName)}.json`);
    try {
      const receipt = await fs.readJson(filePath);
      if (receipt) {
        return receipt;
      }
    } catch {
      // ignore missing
    }
  }
};

class FixturePage extends React.Component {
  static async getInitialProps({ req, query }) {
    const isServer = Boolean(req);
    if (isServer) {
      const { name } = path.parse(query.fixture);
      const receipt = await loadFixture(name);
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
