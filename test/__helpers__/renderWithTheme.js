import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/constants/theme';

const renderWithTheme = component => {
  return renderer.create(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

export default renderWithTheme;
