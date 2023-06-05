import { gql } from '@apollo/client';
import { createClient } from '.';

const receiptTransactionHostFieldsFragment = gql`
  fragment ReceiptTransactionHostFieldsFragment on Account {
    id
    slug
    name
    legalName
    currency
    imageUrl(height: 200)
    website
    settings
    type
    location {
      name
      address
      country
    }
  }
`;

const receiptTransactionFragment = gql`
  fragment ReceiptTransactionFragment on Transaction {
    id
    type
    kind
    createdAt
    description
    hostCurrencyFxRate
    invoiceTemplate
    host {
      ...ReceiptTransactionHostFieldsFragment
    }
    amount {
      valueInCents
      currency
    }
    amountInHostCurrency {
      valueInCents
      currency
    }
    netAmount {
      valueInCents
      currency
    }
    taxAmount {
      valueInCents
      currency
    }
    taxInfo {
      type
      rate
    }
    type
    fromAccount {
      id
      slug
      name
      legalName
      type
      location {
        name
        address
        country
      }
      ... on AccountWithHost {
        host {
          ...ReceiptTransactionHostFieldsFragment
        }
      }
      ... on Organization {
        host {
          ...ReceiptTransactionHostFieldsFragment
        }
      }
    }
    toAccount {
      id
      slug
      legalName
      name
      type
      ... on AccountWithHost {
        host {
          ...ReceiptTransactionHostFieldsFragment
        }
      }
      ... on Organization {
        host {
          ...ReceiptTransactionHostFieldsFragment
        }
      }
      ... on Event {
        startsAt
        endsAt
        timezone
      }
    }
    giftCardEmitterAccount {
      id
      slug
      name
      legalName
      type
    }
    isRefund
    refundTransaction {
      id
    }
    order {
      id
      legacyId
      data
      taxes {
        type
        percentage
      }
      quantity
      tier {
        id
        type
        invoiceTemplate
      }
    }
  }
  ${receiptTransactionHostFieldsFragment}
`;

export async function fetchInvoiceByDateRange(
  { fromCollectiveSlug, hostSlug, dateFrom, dateTo, hasExpense },
  accessToken,
  apiKey,
) {
  const query = gql`
    query InvoiceByDateRange(
      $fromCollectiveSlug: String!
      $hostSlug: String!
      $dateFrom: DateTime!
      $dateTo: DateTime!
      $hasExpense: Boolean
    ) {
      host(slug: $hostSlug) {
        ...ReceiptTransactionHostFieldsFragment
      }
      fromAccount: account(slug: $fromCollectiveSlug) {
        id
        slug
        name
        legalName
        currency
        type
        settings
        location {
          name
          address
          country
        }
        ... on AccountWithHost {
          host {
            ...ReceiptTransactionHostFieldsFragment
          }
        }
        ... on Organization {
          host {
            ...ReceiptTransactionHostFieldsFragment
          }
        }
      }
      transactions(
        fromAccount: { slug: $fromCollectiveSlug }
        host: { slug: $hostSlug }
        dateFrom: $dateFrom
        dateTo: $dateTo
        limit: 1000
        includeIncognitoTransactions: true
        includeGiftCardTransactions: true
        hasExpense: $hasExpense
        kind: [CONTRIBUTION, PLATFORM_TIP]
      ) {
        totalCount
        nodes {
          ...ReceiptTransactionFragment
        }
      }
    }
    ${receiptTransactionFragment}
    ${receiptTransactionHostFieldsFragment}
  `;

  const client = createClient(accessToken, apiKey);
  const { data } = await client.query({
    query,
    variables: { fromCollectiveSlug, hostSlug, dateFrom, dateTo, hasExpense },
    fetchPolicy: 'no-cache',
  });

  if (!data.host) {
    throw new Error(`Host ${hostSlug} doesn't exist`);
  } else if (!data.fromAccount) {
    throw new Error(`Account ${fromCollectiveSlug} doesn't exist`);
  }

  return data;
}

export async function fetchTransactionInvoice(transactionId, accessToken, apiKey) {
  const query = gql`
    query TransactionInvoice($transactionId: String!) {
      transaction(id: $transactionId) {
        id
        type
        kind
        ... on Credit {
          ...ReceiptTransactionFragment
        }
        ... on Debit {
          oppositeTransaction {
            ...ReceiptTransactionFragment
          }
        }
      }
    }
    ${receiptTransactionFragment}
  `;

  const client = createClient(accessToken, apiKey);
  let response;
  try {
    response = await client.query({
      query,
      variables: { transactionId },
      fetchPolicy: 'no-cache',
    });
  } catch (e) {
    console.error('Query Error', JSON.stringify(e, null, 2));
    throw e;
  }

  if (!response.data.transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  return response.data.transaction;
}

/**
 * Fetch expense's data to generate an invoice.
 *
 * @param {string} expenseId
 */
export async function fetchExpenseInvoiceData(expenseId, accessToken, apiKey) {
  const query = gql`
    query ExpenseInvoice($expenseId: String!) {
      expense(expense: { id: $expenseId }) {
        id
        legacyId
        description
        currency
        type
        invoiceInfo
        amount
        taxes {
          id
          type
          rate
          idNumber
        }
        createdAt
        account {
          id
          type
          name
          legalName
          slug
          imageUrl
          settings
          location {
            address
            country
          }
          ... on AccountWithHost {
            host {
              id
              name
              legalName
              slug
              type
              expensePolicy
              settings
              location {
                address
                country
              }
            }
          }
        }
        payee {
          id
          type
          name
          legalName
          slug
          imageUrl
          ... on AccountWithHost {
            host {
              id
              name
              slug
              type
              expensePolicy
              location {
                address
                country
              }
            }
          }
        }
        payeeLocation {
          address
          country
        }
        items {
          id
          amount
          description
          incurredAt
          url
        }
      }
    }
  `;

  const client = createClient(accessToken, apiKey);
  const result = await client.query({ query, variables: { expenseId } });
  return result.data.expense;
}
