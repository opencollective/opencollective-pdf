import React from 'react';
import InvoicePage from '../../pages/invoice';

import renderWithTheme from '../__helpers__/renderWithTheme';
import simpleTransactionInvoice from '../__fixtures__/invoices/simple-transaction';
import organizationWithGiftCardsInvoiceMonthly from '../__fixtures__/invoices/organization-gift-cards-monthly';
import organizationWithGiftCardsInvoiceYearly from '../__fixtures__/invoices/organization-gift-cards-yearly';
import invoiceWithTaxes from '../__fixtures__/invoices/transactions-with-tax';

describe('Single transaction invoice', () => {
  test('simple transaction', () => {
    const tree = renderWithTheme(<InvoicePage invoice={simpleTransactionInvoice} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('with taxes', () => {
    const tree = renderWithTheme(<InvoicePage invoice={invoiceWithTaxes} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Monthly invoice', () => {
  test('for organization with gift cards', () => {
    const tree = renderWithTheme(<InvoicePage invoice={organizationWithGiftCardsInvoiceMonthly} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Yearly invoice', () => {
  test('for organization with gift cards', () => {
    const tree = renderWithTheme(<InvoicePage invoice={organizationWithGiftCardsInvoiceYearly} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
