import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';
import { Box, Flex } from 'rebass/styled-components';
import styled from 'styled-components';
import Container from '@bit/opencollective.design-system.components.styled-container';
import { objectToQueryString } from '../lib/utils';
import PageFormat from '../lib/constants/page-format';

const ResponsiveIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default class Home extends Component {
  static getInitialProps({ query: { selectedTestUrl, pageFormat, debug } }) {
    return {
      selectedTestUrl: selectedTestUrl && decodeURIComponent(selectedTestUrl),
      pageFormat: pageFormat || 'A4',
      debug: debug || 'false',
    };
  }

  static propTypes = {
    selectedTestUrl: PropTypes.string,
    pageFormat: PropTypes.string.isRequired,
    debug: PropTypes.string.isRequired,
  };

  /** All pages as [testFilename]: Title */
  static Menu = {
    'donation-receipt': 'Donation receipt',
    'simple-transaction': 'Simple transaction',
    'organization-gift-cards-monthly': 'Organization with gift cards',
    'transactions-with-tax': 'With taxes',
    'transactions-with-date-range': 'With date range',
  };

  updateSearch = (changes) => {
    document.location.search = objectToQueryString({
      ...pick(this.props, ['selectedTestUrl', 'pageFormat', 'debug']),
      ...changes,
    });
  };

  renderLink(slug, format, queryString = '') {
    const testPath = `/fixtures/${slug}.${format}`;
    const link = `${testPath}${queryString}`;
    return (
      <a
        href={link}
        onClick={(e) => {
          this.updateSearch({ selectedTestUrl: encodeURIComponent(testPath) });
          // Only prevent if left click
          if (e.button === 0) {
            e.preventDefault();
          }
        }}
      >
        {format}
      </a>
    );
  }

  renderFormats(slug) {
    const queryString = objectToQueryString({
      pageFormat: this.props.pageFormat,
      debug: this.props.debug,
    });

    return (
      <React.Fragment>
        {this.renderLink(slug, 'html', queryString)}
        {', '}
        {this.renderLink(slug, 'pdf', queryString)}
        {', '}
        {this.renderLink(slug, 'json', queryString)}
      </React.Fragment>
    );
  }

  getDimensions() {
    const { unit, page } = PageFormat[this.props.pageFormat];
    return { width: `${page.width}${unit}`, height: `${page.height}${unit}` };
  }

  getIframeUrl = () => {
    if (!this.props.selectedTestUrl) {
      return false;
    }

    const queryString = objectToQueryString({
      pageFormat: this.props.pageFormat,
      debug: this.props.debug,
      // prevent browser from caching iframe by adding a `__cache`
      __cache: Date.now(),
    });

    return `${this.props.selectedTestUrl}${queryString}`;
  };

  render() {
    const dimensions = this.getDimensions();
    const iframeURL = this.getIframeUrl();
    const isDebugMode = this.props.debug === 'true';

    return (
      <div>
        <h1>This is the Open Collective invoices server 📄</h1>
        <Flex p={10} flexWrap="wrap">
          <Box flex="0 1 350px" mr={[0, 30, 50]}>
            <h2 style={{ marginTop: 0 }}>Test settings</h2>
            <div>
              <div>
                <label htmlFor="pageFormat" style={{ marginRight: 10 }}>
                  Page format
                </label>
                <select
                  id="pageFormat"
                  value={this.props.pageFormat}
                  onChange={(e) => this.updateSearch({ pageFormat: e.target.value })}
                >
                  <option>A4</option>
                  <option>Letter</option>
                </select>
              </div>
              <br />
              <div>
                <label htmlFor="debug" style={{ marginRight: 10 }}>
                  Debug mode
                </label>
                <input
                  type="checkbox"
                  id="debug"
                  name="debug"
                  checked={isDebugMode}
                  onChange={() => this.updateSearch({ debug: isDebugMode ? 'false' : 'true' })}
                />
              </div>
            </div>
            <h2>Test pages</h2>
            <ul>
              {Object.keys(Home.Menu).map((slug) => (
                <li key={slug}>
                  {Home.Menu[slug]} ({this.renderFormats(slug)})
                </li>
              ))}
            </ul>
          </Box>
          <Container
            position="relative"
            mx={15}
            border="1px solid lightgrey"
            height={dimensions.height}
            width={dimensions.width}
          >
            {iframeURL && <ResponsiveIframe name="test-preview" src={iframeURL} />}
          </Container>
        </Flex>
      </div>
    );
  }
}
