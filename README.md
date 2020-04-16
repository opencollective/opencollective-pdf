# Open Collective PDF service

[![Circle CI](https://circleci.com/gh/opencollective/opencollective-invoices/tree/master.svg?style=shield)](https://circleci.com/gh/opencollective/opencollective-invoices/tree/master)
[![Slack Status](https://slack.opencollective.org/badge.svg)](https://slack.opencollective.org)
[![codecov](https://codecov.io/gh/opencollective/opencollective-invoices/branch/master/graph/badge.svg)](https://codecov.io/gh/opencollective/opencollective-invoices)

## Foreword

If you see a step below that could be improved (or is outdated), please update the instructions. We rarely go through this process ourselves, so your fresh pair of eyes and your recent experience with it, makes you the best candidate to improve them for other users. Thank you!

## Development

### Prerequisite

Make sure you have Node.js version >= 10.
We recommend using [nvm](https://github.com/creationix/nvm): `nvm use`.

### Install

We recommend cloning the repository in a folder dedicated to `opencollective` projects.

```
git clone git@github.com:opencollective/opencollective-invoices.git opencollective/invoices
cd opencollective/invoices
npm install
```

### Environment variables

This project requires an access to the Open Collective API. You have two options:

- `cp .env.staging .env` to connect to the Open Collective staging API
- `cp .env.local .env` to connect to the API running locally

If you decide to pick the local strategy, make sure you install and run the [opencollective-api](https://github.com/opencollective/opencollective-api) project.

### Start

To start the service:

```
npm run dev
```

#### Usage with fixture data

This is the easy way to start developing. Just go to the root URL http://localhost:3002/
to see a list of test pages and click on any of them to load it in the right pane.

The page will auto-refresh everytime a change is made.

#### Usage with frontend

If you use this service through local frontend, you're ready to go - frontend will pass your authorization token directly to the app.

However this is not practical to develop, you should only use it to debug the
bridge between the two services.

#### Calling URLs directly

This method can be usefull to debug staging or production invoices, or to work
with you local development data. It is also the best way if you need to make changes to
the graphql queries.

The easier to make it work is to go to `/applications` on the frontend,
generate an api key, and to add `?app_key=your_key_here` to all your requests.

**Tips**

- Replace `.html` by `.pdf` to see the generated pdf.
- Add `?pageFormat=A4` with `A4` or `Letter` to change page format
- Add `?debug=true` to the URL to see verbose data on the document
- Add `?raw=true` to disabled HTML sanitazing (useful to debug missing attributes)

## Contributing

Code style? Commit convention? Please check our [Contributing guidelines](CONTRIBUTING.md).

TL;DR: we use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/), we do like great commit messages and clean Git history.

## Tests

You can run the tests using `npm test`.
