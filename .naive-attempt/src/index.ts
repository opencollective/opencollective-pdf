import express from "express";
import { StatusCodes } from "http-status-codes";
import taxFormsRouter from "./routes/tax-forms";
import expensesRouter from "./routes/expenses";
import giftCardsRouter from "./routes/gift-cards";
import collectivesRouter from "./routes/collectives";
import transactionsRouter from "./routes/transactions";

const app = express();
const port = process.env.PORT || 3000;

// Routes
app.use("/tax-forms", taxFormsRouter);
app.use("/expenses", expensesRouter);
app.use("/gift-cards", giftCardsRouter);
app.use("/collectives/transactions", collectivesRouter);
app.use("/transactions", transactionsRouter);

// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An internal server error occurred",
    });
  }
);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route not found",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
