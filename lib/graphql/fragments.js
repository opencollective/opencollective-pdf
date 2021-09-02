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
          }
        }
      }
    }
  }
`;
