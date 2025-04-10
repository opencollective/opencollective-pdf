import dotenv from 'dotenv';

import express from 'express';
import rateLimit from 'express-rate-limit';

import expensesRouter from './routes/expenses.js';
import giftCardsRouter from './routes/gift-cards.js';
import receiptsRouter from './routes/receipts.js';
import taxFormsRouter from './routes/tax-forms.js';
import { PDFServiceError } from './lib/errors.js';
import path from 'path';

import { last } from 'lodash-es';

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

if (process.env.EXTRA_ENV || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  const extraEnv = process.env.EXTRA_ENV || last(process.argv);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const extraEnvPath = path.join(__dirname, '..', `.env.${extraEnv}`);
  if (fs.existsSync(extraEnvPath)) {
    dotenv.config({ path: extraEnvPath });
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure rate limiter
const apiLimiter = rateLimit({
  // Limit each IP to 100 requests per 15 minutes
  max: 100,
  windowMs: 15 * 60 * 1000,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  // Skip rate limiter if request has the official OC API key
  skip: req => {
    const officialKey = process.env.OFFICIAL_OC_KEY;
    if (!officialKey) {
      return false;
    } else {
      const apiKey = req.headers['x-api-key'] || req.query.apiKey;
      return apiKey === officialKey;
    }
  },
});

// Apply rate limiting to all routes
app.use(apiLimiter);

// Disable cache on all requests
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Cache-Control', 'private');
  next();
});

// Set CORS headers
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Set Access-Control-Allow-Headers
  res.setHeader('Access-Control-Allow-Headers', 'authorization,content-type,baggage,sentry-trace,x-api-key');

  // Set Access-Control-Allow-Origin
  if (process.env.WEBSITE_URL === 'https://opencollective.com' || process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', 'https://opencollective.com');
  } else {
    // Always allow requests on non-prod environments
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  next();
});

// Routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/expenses', expensesRouter);
app.use('/gift-cards', giftCardsRouter);
app.use('/receipts', receiptsRouter);
app.use('/tax-forms', taxFormsRouter);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Node loses the error type when passing it around, we use the `isPDFServiceError` property to circumvent this
  if (err && (err instanceof PDFServiceError || err['isPDFServiceError'])) {
    res.status((err as PDFServiceError).status).json({ message: err.message });
  } else {
    console.error('Unexpected error', err);
    res.status(500).json({
      message: 'An internal server error occurred',
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
