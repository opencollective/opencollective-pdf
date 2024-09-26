import express from 'express';
import helmet from 'helmet';
import * as ReactDOMServer from 'react-dom/server';
import Home from './pages/status';

export default function start() {
  const expressApp = express();

  // Middlewares
  expressApp.use(helmet());
  // TODO: Error handling

  // Never cache requests
  expressApp.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  // Routes
  expressApp.get('/', (req, res) => {
    const html = ReactDOMServer.renderToString(Home());
    res.send(html);
  });

  // TODO get port from env
  const server = expressApp.listen(3002, () => {
    console.info('Server started on port 3002');
  });

  server.timeout = 30_000;
  return expressApp;
}

start();
