import "dotenv/config";

import express from "express";

import expensesRouter from "./routes/expenses";
import giftCardsRouter from "./routes/gift-cards";
import { PDFServiceError } from "./utils/errors";

const app = express();
const port = process.env.PORT || 3002;

// Set CORS headers
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Set Access-Control-Allow-Headers
    res.setHeader(
      "Access-Control-Allow-Headers",
      "authorization,content-type,baggage,sentry-trace"
    );

    // Set Access-Control-Allow-Origin
    if (process.env.WEBSITE_URL === "https://opencollective.com") {
      res.setHeader("Access-Control-Allow-Origin", process.env.WEBSITE_URL);
    } else {
      // Always allow requests on non-prod environments
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    next();
  }
);

// Routes
// app.use("/tax-forms", taxFormsRouter);
app.use("/expenses", expensesRouter);
app.use("/gift-cards", giftCardsRouter);
// app.use("/collectives/transactions", collectivesRouter);
// app.use("/transactions", transactionsRouter);

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof PDFServiceError) {
      res.status(err.status).json({
        message: err.message,
      });
    } else {
      console.error(err);
      res.status(500).json({
        message: "An internal server error occurred",
      });
    }
  }
);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

app.listen(8000);
