import express from 'express';
import { sendPDFResponse } from '../lib/pdf.js';
import { authenticateRequest, AuthorizationHeaders } from '../lib/authentication.js';
import { gql } from '@apollo/client/index.js';
import { createClient } from '../lib/apollo-client.js';
import { adaptApolloError } from '../lib/apollo-client.js';
import ExpenseInvoice from '../components/expenses/ExpenseInvoice.js';
import { ExpenseInvoiceQuery } from '../graphql/types/v2/graphql.js';
import { NotFoundError } from '../lib/errors.js';

const router = express.Router();

async function fetchExpenseInvoiceData(expenseId: string, authorizationHeaders: AuthorizationHeaders) {
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
        reference
        permissions {
          canSeeInvoiceInfo
        }
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
        payeeLocation {
          address
          country
        }
        items {
          id
          description
          incurredAt
          url
          amountV2 {
            valueInCents
            currency
            exchangeRate {
              fromCurrency
              toCurrency
              value
              date
              isApproximate
              source
            }
          }
        }
      }
    }
  `;

  const client = createClient(authorizationHeaders);
  try {
    const result = await client.query<ExpenseInvoiceQuery>({ query, variables: { expenseId } });
    if (result.error) {
      throw adaptApolloError(result.error);
    }

    return result.data.expense;
  } catch (error) {
    throw adaptApolloError(error);
  }
}

router.options('/:id/:filename.pdf', (req, res) => {
  res.sendStatus(204);
});

router.get('/:id/:filename.pdf', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const authorizationHeaders = authenticateRequest(req);
  const expense = await fetchExpenseInvoiceData(id, authorizationHeaders);
  if (expense === null || expense === undefined) {
    throw new NotFoundError(`Expense not found`);
  } else {
    await sendPDFResponse(res, ExpenseInvoice, { expense });
  }
});

export default router;
