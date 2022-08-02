import { createClient, gqlV1, API_V1_CONTEXT, gqlV2 } from '.';

export async function fetchInvoiceByDateRange(
  { fromCollectiveSlug, hostSlug, dateFrom, dateTo, hasExpense },
  accessToken,
  apiKey,
) {
  const query = gqlV2/* GraphQL */ `
    query InvoiceByDateRange(
      $fromCollectiveSlug: String!
      $hostSlug: String!
      $dateFrom: DateTime!
      $dateTo: DateTime!
      $hasExpense: Boolean
    ) {
      host(slug: $hostSlug) {
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
            id
            slug
            name
            legalName
            imageUrl
            website
            settings
            type
            location {
              name
              address
              country
            }
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
          id
          createdAt
          description
          hostCurrencyFxRate
          ... on Credit {
            id
            invoiceTemplate
          }
          ... on Debit {
            id
            invoiceTemplate
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
            type
          }
          giftCardEmitterAccount {
            id
            slug
            name
            legalName
            type
          }
          toAccount {
            id
            slug
            name
            type
          }
          isRefund
          order {
            id
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
      }
    }
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
    throw new Error(`Accout ${fromCollectiveSlug} doesn't exist`);
  }

  return data;
}

/**
 * Fetch invoice for a single transaction.
 * This endpoint doesn't require authentication because we assume that the `uuid`
 * is private to the user.
 *
 * @param {string} transactionUuid
 */
export async function fetchTransactionInvoice(transactionUuid, accessToken, apiKey) {
  const query = gqlV1`
    query TransactionInvoice($transactionUuid: String!) {
      TransactionInvoice(transactionUuid: $transactionUuid) {
        slug
        dateFrom
        dateTo
        year
        month
        day
        host {
          id
          slug
          name
          legalName
          image
          website
          settings
          type
          location {
            name
            address
            country
          }
        }
        fromCollective {
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
          createdByUser {
            name
          }
          host {
            id
            slug
            name
            legalName
            image
            website
            settings
            type
            location {
              name
              address
              country
            }
          }
        }
        transactions {
          id
          createdAt
          description
          amount
          currency
          type
          hostCurrency
          amountInHostCurrency
          hostCurrencyFxRate
          netAmountInCollectiveCurrency
          taxAmount
          kind
          invoiceTemplate
          taxInfo {
            type
            rate
            idNumber
          }
          fromCollective {
            id
            slug
            name
            legalName
            type
          }
          usingGiftCardFromCollective {
            id
            slug
            name
            legalName
            type
          }
          refundTransaction {
            id
          }
          collective {
            id
            slug
            name
            legalName
            type
          }
          ... on Order {
            order {
              id
              quantity
              tier {
                id
                type
                data
              }
            }
          }
        }
      }
    }
  `;

  const client = createClient(accessToken, apiKey);
  const result = await client.query({
    query,
    variables: { transactionUuid },
    context: API_V1_CONTEXT,
    fetchPolicy: 'no-cache',
  });
  return result.data.TransactionInvoice;
}

/**
 * Fetch expense's data to generate an invoice.
 *
 * @param {string} expenseId
 */
export async function fetchExpenseInvoiceData(expenseId, accessToken, apiKey) {
  const query = gqlV2`
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
