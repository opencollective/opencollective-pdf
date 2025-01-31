import React from 'react';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import PageFormat from '../lib/constants/page-format';

const getPageWidth = (pageFormat) => {
  const dimensions = PageFormat[pageFormat] || PageFormat.A4;
  return `${dimensions.page.width}${dimensions.unit}`;
};

const GlobalPDFStyles = createGlobalStyle`
  body {
    width: ${(props) => getPageWidth(props.pageFormat)};
    padding: 0;
    margin: 0;
  }
`;

export default class PDFLayout extends React.Component {
  render() {
    const { pageFormat, children } = this.props;
    return (
      <React.Fragment>
        <GlobalPDFStyles pageFormat={pageFormat} />
        {children}
      </React.Fragment>
    );
  }
}

PDFLayout.propTypes = {
  children: PropTypes.node,
  pageFormat: PropTypes.oneOf(Object.keys(PageFormat)),
};

PDFLayout.defaultProps = {
  format: 'A4',
};
