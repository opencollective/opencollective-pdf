import React from 'react';
import renderer from 'react-test-renderer'; // eslint-disable-line node/no-unpublished-import
import { ThemeProvider } from 'styled-components';
import theme from '../../lib/theme';

const renderWithTheme = (component) => {
  return renderer.create(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

export default renderWithTheme;
