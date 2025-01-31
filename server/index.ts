import express from "express";

import giftCardsRouter from "./routes/gift-cards.tsx";

const app = express();
const port = process.env.PORT || 3002;

// Routes
// app.use("/tax-forms", taxFormsRouter);
// app.use("/expenses", expensesRouter);
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
    console.error(err.stack);
    res.status(500).json({
      message: "An internal server error occurred",
    });
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
