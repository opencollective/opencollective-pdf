import { gqlV1 } from '.';

export const invoiceFields = gqlV1`
  fragment InvoiceFields on InvoiceType {
    title
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
      location {
        name
        address
        country
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
      usingVirtualCardFromCollective {
        id
        slug
        name
        type
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
