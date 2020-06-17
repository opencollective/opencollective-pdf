import React from 'react';
import App, { Container } from 'next/app';
import { ThemeProvider } from 'styled-components';

import theme from '../constants/theme';

class OpenCollectiveFrontendApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}

export default OpenCollectiveFrontendApp;
