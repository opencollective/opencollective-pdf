import React from "react";
import express from "express";
import { sendPDFResponse } from "../utils/pdf";
import {
  authenticateRequest,
  AuthorizationHeaders,
} from "../utils/authentication";
import { gql } from "@apollo/client";
import { createClient } from "../utils/apollo-client";
import { adaptApolloError } from "../utils/apollo-client";
import { BadRequestError } from "../utils/errors";
import ExpenseInvoice from "../components/expenses/ExpenseInvoice";

const router = express.Router();

async function fetchExpenseInvoiceData(
  expenseId: string,
  authorizationHeaders: AuthorizationHeaders
) {
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
    const result = await client.query({ query, variables: { expenseId } });
    return result.data.expense;
  } catch (error) {
    throw adaptApolloError(error);
  }
}

router.options("/:id/:filename.pdf", (req, res) => {
  res.sendStatus(204);
});

router.get(
  "/:id/:filename.pdf",
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const authorizationHeaders = authenticateRequest(req);
    const expense = await fetchExpenseInvoiceData(id, authorizationHeaders);
    await sendPDFResponse(res, ExpenseInvoice, { expense });
  }
);

export default router;
