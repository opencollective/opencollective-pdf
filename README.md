# Open Collective PDF service

## Foreword

If you see a step below that could be improved (or is outdated), please update the instructions. We rarely go through this process ourselves, so your fresh pair of eyes and your recent experience with it, makes you the best candidate to improve them for other users. Thank you!

## Development

### Prerequisite

### Install

We recommend cloning the repository in a folder dedicated to `opencollective` projects.

```
git clone git@github.com:opencollective/opencollective-pdf.git opencollective/pdf
cd opencollective/pdf
npm install
```

### Start

To start the service:

```
npm run dev
```

#### Usage with frontend

If you use this service through local frontend, you will need to add `PDF_SERVICE_URL=http://localhost:3002` line to `.env`. You're ready to go - frontend will pass your authorization token directly to the app.

However this is not practical to develop, you should only use it to debug the
bridge between the two services.

#### Calling URLs directly

This method can be usefull to debug staging or production invoices, or to work
with you local development data. It is also the best way if you need to make changes to
the graphql queries.

The easier to make it work is to go to `/:userSlug/admin/for-developers` on the frontend,
generate a personal token, and to add `?personalToken=your_key_here` to all your requests.

## Contributing

Code style? Commit convention? Please check our [Contributing guidelines](CONTRIBUTING.md).

TL;DR: we use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/), we do like great commit messages and clean Git history.

## Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Run tests with coverage report: `npm run test:coverage`

Be aware that `watch` currently doesn't auto-reload the express app.

## Deployment

Merging to `main` branch will auto-deploy the pdf service to Heroku.

## Monitoring (Sentry)

Errors (including uncaught exceptions and unhandled rejections), traces, and profiles are
reported to Sentry with `@sentry/node` when `SENTRY_DSN` is set. Sampling is off by default.
The SDK is initialized in `instrument.ts`, loaded before the app via `node --import`
(see https://docs.sentry.io/platforms/javascript/guides/express/).

| Variable                      | Default               | Description                                             |
| ----------------------------- | --------------------- | ------------------------------------------------------- |
| `SENTRY_DSN`                  | (unset = disabled)    | Sentry project DSN for `opencollective-pdf`             |
| `SENTRY_ENVIRONMENT`          | `OC_ENV` / `NODE_ENV` | Sentry environment                                      |
| `SENTRY_TRACES_SAMPLE_RATE`   | `0`                   | Tracing sample rate (`0`–`1`)                           |
| `SENTRY_PROFILES_SAMPLE_RATE` | `0`                   | Profiling sample rate (`0`–`1`, profiler loads when >0) |

Set these as Heroku config vars on staging/production. Expected client errors (3xx/4xx,
including `PDFServiceError` with a status below 500) are not reported; 5xx and status-less
errors are. `Authorization` / API-key headers, cookies, and token query params are redacted
before sending (see `server/lib/sentry.ts`).

### Verifying Sentry end-to-end

`GET /debug-sentry?key=<DEBUG_SENTRY_KEY>` throws a test error that Sentry captures.
It behaves like an unknown route (404) unless `DEBUG_SENTRY_KEY` is configured and the
`key` query parameter matches it. Set `DEBUG_SENTRY_KEY` only where you need to verify
(e.g. staging), never as a long-lived production secret.

## Monitoring (Hyperwatch)

Access logs can be followed by [Watch](https://github.com/opencollective/opencollective-watch) with
[Hyperwatch](https://github.com/hyperwatch/hyperwatch). Off by default. Credentials (auth and API-key
headers, cookies, token query params) are redacted from the logs.

| Variable              | Default          | Description                                                   |
| --------------------- | ---------------- | ------------------------------------------------------------- |
| `HYPERWATCH_ENABLED`  | (unset = off)    | Record access logs                                            |
| `HYPERWATCH_PATH`     | `/_hyperwatch`   | Where the Hyperwatch API and WebSocket streams are mounted    |
| `HYPERWATCH_USERNAME` | `opencollective` | Basic auth username                                           |
| `HYPERWATCH_SECRET`   | (unset)          | Basic auth password; nothing is mounted without it            |
| `OC_SECRET`           | (unset)          | Sent to the API as `oc-secret`, so Watch can verify our calls |
