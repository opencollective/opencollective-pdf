import nextRoutes from 'next-routes';
import controllers from './controllers';
import { maxAge } from './middlewares';

const router = nextRoutes();

export default (server, app) => {
  /**
   * By default, we cache all GET calls for 30s at the CDN level (cloudflare)
   * note: only for production/staging (NextJS overrides this in development env)
   */
  server.get('*', maxAge(30));

  /**
   * Endpoint to download invoice in HTML, PDF or JSON
   */
  server.get(
    '/collectives/:fromCollectiveSlug/:toCollectiveSlug/:isoStartDate/:isoEndDate.:format(html|pdf|json)',
    (req, res, next) => {
      req.app = app;
      next();
    },
    controllers.transactions.invoiceByDateRange,
  );

  /**
   * Endpoint to download a single transaction invoice in HTML, PDF or JSON
   */
  server.get(
    '/:collectiveSlug?/transactions/:transactionUuid/invoice.:format(pdf|html)',
    (req, res, next) => {
      req.app = app;
      next();
    },
    controllers.transactions.transactionInvoice,
  );

  server.get(
    '/__test__/:fixture.:format(pdf|html|json)',
    (req, res, next) => {
      req.app = app;
      next();
    },
    controllers.transactions.testFixture,
  );

  return router.getRequestHandler(server.next);
};
