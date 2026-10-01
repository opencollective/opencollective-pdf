import dotenv from 'dotenv';
import fs from 'fs';
import { last } from 'lodash-es';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Loads `.env` files into `process.env`. This module has side effects on import and must stay
 * imported before `./sentry.js`, so Sentry initializes with the configured environment.
 */
if (process.env.EXTRA_ENV || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  const extraEnv = process.env.EXTRA_ENV || last(process.argv);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const extraEnvPath = path.join(__dirname, '..', '..', `.env.${extraEnv}`);
  if (fs.existsSync(extraEnvPath)) {
    dotenv.config({ path: extraEnvPath });
  }
}

dotenv.config();
