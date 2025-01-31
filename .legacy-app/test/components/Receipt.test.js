import React from 'react';
import Receipt from '../../components/Receipt';
import { snapshotRenderWithoutAttributes } from '../__helpers__/render';

const MOCK_ORGANIZATION = Object.freeze({
  id: '4695aabc-8aa6-11ee-ad3e-4ce17342669c',
  slug: 'super-org',
  name: 'Super Organization',
  legalName: 'Super Organization Inc.',
  imageUrl: 'https://images.opencollective.com/super-org/4695aabc-8aa6-11ee-ad3e-4ce17342669c/logo.png',
  type: 'ORGANIZATION',
  settings: {
    VAT: {
      number: 'FR123456789',
    },
  },
  location: {
    name: 'Paris',
    address: 'Rue de Rivoli',
    country: 'France',
  },
});

const MOCK_COLLECTIVE = Object.freeze({
  id: '7c6d8b7a-8aa6-11ee-ad3e-4ce17342669c',
  slug: 'babel',
  name: 'Babel',
  type: 'COLLECTIVE',
  currency: 'EUR',
  imageUrl: 'https://images.opencollective.com/babel/7c6d8b7a-8aa6-11ee-ad3e-4ce17342669c/logo.png',
});

const MOCK_HOST = Object.freeze({
  id: 'a2f2aabc-8aa6-11ee-ad3e-4ce17342669c',
  slug: 'europe',
  name: 'OC Europe',
  legalName: 'Open Collective Europe',
  type: 'ORGANIZATION',
  imageUrl: 'https://images.opencollective.com/europe/a2f2aabc-8aa6-11ee-ad3e-4ce17342669c/logo.png',
  settings: {
    VAT: {
      number: 'FR123456789',
    },
  },
  location: {
    name: 'Brussels',
    address: '123 Law Street, 1000 Bruxelles',
    country: 'BE',
  },
});

const BASE_RECEIPT = Object.freeze({
  currency: 'EUR',
  totalAmount: 10000,
  fromAccount: MOCK_ORGANIZATION,
  host: MOCK_HOST,
  transactions: [
    {
      id: '4c8f436a-8aa6-11ee-bc7e-4ce17342669c',
      type: 'CREDIT',
      amount: { valueInCents: 10000, currency: 'EUR' },
      amountInHostCurrency: { valueInCents: 10000, currency: 'EUR' },
      hostCurrencyFxRate: 1,
      createdAt: '2020-01-01T00:00:00.000Z',
      description: 'Contribution to babel',
      fromAccount: MOCK_ORGANIZATION,
      toAccount: MOCK_COLLECTIVE,
      host: MOCK_HOST,
    },
  ],
});

const filterInvoiceContentNode = (node) => node.props?.id === 'invoice-content';

describe('Receipt', () => {
  it('should render with no transactions', () => {
    snapshotRenderWithoutAttributes(<Receipt receipt={{ ...BASE_RECEIPT, transactions: [] }} />);
  });

  describe('Contributions', () => {
    it('should render with a simple contribution', () => {
      snapshotRenderWithoutAttributes(<Receipt receipt={BASE_RECEIPT} />);
    });

    it('should render a contribution with collective currency !== host currency', () => {
      const receipt = {
        ...BASE_RECEIPT,
        transactions: [
          {
            ...BASE_RECEIPT.transactions[0],
            amount: { valueInCents: 10916, currency: 'USD' },
            toAccount: { ...BASE_RECEIPT.transactions[0].toAccount, currency: 'USD' },
            hostCurrencyFxRate: 1 / 1.0916,
          },
        ],
      };

      snapshotRenderWithoutAttributes(<Receipt receipt={receipt} />, filterInvoiceContentNode);
    });

    // TODO
    // it('should render a contribution with a tax (VAT)', () => {});
    // it('should render a contributions between collectives (same host)', () => {});
    // it('should render a contributions between collectives (different host)', () => {});
    // it('should render a contributions list', () => {});
  });

  // describe('Expenses', () => {}`);
});
