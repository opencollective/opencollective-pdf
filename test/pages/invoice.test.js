import React from 'react';
import InvoicePage from '../../src/pages/invoice';

import renderWithTheme from '../__helpers__/renderWithTheme';
import simpleTransactionInvoice from '../__fixtures__/invoices/simple-transaction';
import organizationWithGiftCardsInvoice from '../__fixtures__/invoices/organization-gift-cards';

describe('Single transaction invoice', () => {
  test('simple transaction', () => {
    const tree = renderWithTheme(<InvoicePage invoice={simpleTransactionInvoice} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Monthly invoice', () => {
  test('for organization with gift cards', () => {
    const tree = renderWithTheme(<InvoicePage invoice={organizationWithGiftCardsInvoice} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
