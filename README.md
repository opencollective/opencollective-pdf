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

If you use this service through local frontend, you will need to add `PDF_SERVICE_V2_URL=http://localhost:3002` line to `.env`. You're ready to go - frontend will pass your authorization token directly to the app.

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
