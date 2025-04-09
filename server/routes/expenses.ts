import express from 'express';
import { sendPDFResponse } from '../lib/pdf';
import { authenticateRequest, AuthorizationHeaders } from '../lib/authentication';
import { gql } from '@apollo/client';
import { createClient } from '../lib/apollo-client';
import { adaptApolloError } from '../lib/apollo-client';
import ExpenseInvoice from '../components/expenses/ExpenseInvoice';
import { ExpenseInvoiceQuery } from 'server/graphql/types/v2/graphql';
import { NotFoundError } from 'server/lib/errors';

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
    throw new NotFoundError();
  }

  await sendPDFResponse(res, ExpenseInvoice, { expense });
});

export default router;
