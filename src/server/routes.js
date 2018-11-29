import controllers from './controllers';
import { maxAge } from './middlewares';
import nextRoutes from 'next-routes';

const router = nextRoutes();

export default (server, app) => {
  /**
   * By default, we cache all GET calls for 30s at the CDN level (cloudflare)
   * note: only for production/staging (NextJS overrides this in development env)
   */
  server.get('*', maxAge(30));

  /**
   * Cache static assets for a longer time
   */
  server.get('/static/*', maxAge(7200));

  /**
   * Default index endpoint, useful to ensure the service runs properly
   */
  server.get('/', (req, res) => {
    res.send('This is the Open Collective invoices server 📄');
  });

  /**
   * Prevent all indexation from search engines (this is a private service)
   */
  server.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

  /**
   * Endpoint to download invoice in HTML, PDF or JSON
   */
  server.get(
    '/collectives/:collectiveSlug/:invoiceSlug.:format(html|pdf|json)',
    (req, res, next) => {
      req.app = app;
      next();
    },
    controllers.transactions.invoice,
  );

  /**
   * Endpoint to download a single transaction invoice in HTML, PDF or JSON
   */
  server.get(
    '/transactions/:transactionUuid/invoice.:format(pdf|html)',
    (req, res, next) => {
      req.app = app;
      next();
    },
    controllers.transactions.transactionInvoice,
  );

  return router.getRequestHandler(server.next);
};
