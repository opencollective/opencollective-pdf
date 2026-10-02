/**
 * Sentry instrumentation entry point.
 *
 * Loaded with `node --import ./dist/instrument.js` (production) or
 * `tsx --import ./instrument.ts` (development) so Sentry initializes before any
 * application code is imported, as recommended in
 * https://docs.sentry.io/platforms/javascript/guides/node/ and
 * https://docs.sentry.io/platforms/javascript/guides/express/.
 *
 * All setup lives in `server/lib/dotenv.ts` (env loading) and `server/lib/sentry.ts`
 * (Sentry init); this file only guarantees load order.
 */
import './server/lib/dotenv.js';
import './server/lib/sentry.js';
