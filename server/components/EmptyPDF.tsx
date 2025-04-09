import React from 'react';
import { Page, Document, Text } from '@react-pdf/renderer';
import { createStylesheetWithFonts } from 'server/lib/react-pdf-utils';

const styles = createStylesheetWithFonts({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
});

const EmptyPDF: React.FC = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>Hello, World!</Text>
    </Page>
  </Document>
);

export default EmptyPDF;
