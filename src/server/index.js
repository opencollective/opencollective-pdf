import './env';

import path from 'path';
import express from 'express';
import next from 'next';
import cors from 'cors';

import { loggerMiddleware, logger } from './logger';
import routes from './routes';

const WEBSITE_URL = process.env.WEBSITE_URL;
const port = process.env.PORT || 3002;
const env = process.env.NODE_ENV || 'development';
const dev = env === 'development' || env === 'docker';

const server = express();
const app = next({ dev, dir: path.dirname(__dirname) });
server.next = app;

app.prepare().then(() => {
  // Configure loggers
  server.use(loggerMiddleware.logger);
  server.use(loggerMiddleware.errorLogger);

  // Set CORS for frontend
  server.use(cors({ origin: WEBSITE_URL }));

  // Configure routes
  server.use(routes(server, app));

  // Start the server
  server.listen(port, err => {
    if (err) throw err;
    logger.info(`Ready on http://localhost:${port}`);
  });
});
