import React from 'react';
import { Page, Document, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
