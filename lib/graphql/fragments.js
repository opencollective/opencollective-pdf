import { gqlV1 } from '.';

export const invoiceFields = gqlV1`
  fragment InvoiceFields on InvoiceType {
    title
    extraInfo
    slug
    dateFrom
    dateTo
    totalAmount
    currency
    year
    month
    day
    host {
      id
      slug
      name
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
      currency
      type
      isIncognito
      settings
      location {
        name
        address
        country
      }
      createdByUser {
        name
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
      netAmountInCollectiveCurrency
      taxAmount
      fromCollective {
        id
        slug
        name
        type
      }
      usingGiftCardFromCollective {
        id
        slug
        name
        type
      }
      refundTransaction {
        id
      }
      collective {
        id
        slug
        name
        type
      }
      ... on Order {
        order {
          id
          quantity
          tier {
            id
            type
          }
        }
      }
    }
  }
`;
