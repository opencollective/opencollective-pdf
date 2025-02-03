import React from "react";
import express from "express";
import { sendPDFResponse } from "../utils/pdf.ts";
import GiftCardsPage from "../components/gift-cards/GiftCardsPage.tsx";
import { authenticateRequest } from "../utils/req.ts";
import { gql } from "@apollo/client";

const router = express.Router();

async function fetchExpenseInvoiceData(
  expenseId: string,
  authorizationHeaders
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

router.get(
  "/:id/:filename.pdf",
  async (req: express.Request, res: express.Response) => {
    const { filename, id } = req.params;
    if (!filename) {
      res.status(400).json({ message: "Filename is required" });
      return;
    } else if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const authorizationHeaders = authenticateRequest(req);
    const expense = await fetchExpenseInvoiceData(id, authorizationHeaders);
    await sendPDFResponse(res, <GiftCardsPage cards={allCards} />);
  }
);

export default router;
