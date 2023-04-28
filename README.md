# Open Collective PDF service

![Build and Push](https://github.com/wei/pull/workflows/Build%20and%20Push/badge.svg)

## Foreword

If you see a step below that could be improved (or is outdated), please update the instructions. We rarely go through this process ourselves, so your fresh pair of eyes and your recent experience with it, makes you the best candidate to improve them for other users. Thank you!

## Development

### Prerequisite

Make sure you have Node.js version >= 10.
We recommend using [nvm](https://github.com/creationix/nvm): `nvm use`.

### Install

We recommend cloning the repository in a folder dedicated to `opencollective` projects.

```
git clone git@github.com:opencollective/opencollective-pdf.git opencollective/pdf
cd opencollective/pdf
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

### Troubleshooting

- SSL errors

If you get an error like this while trying to generate a PDF:

> Error: html-pdf: Unknown Error
> Auto configuration failed
> 140673035953984:error:25066067:DSO support routines:DLFCN_LOAD:could not load the shared library:dso_dlfcn.c:185:filename(libssl_conf.so): libssl_conf.so: cannot > open shared object file: No such file or directory
> 140673035953984:error:25070067:DSO support routines:DSO_load:could not load the shared library:dso_lib.c:244:
> 140673035953984:error:0E07506E:configuration file routines:MODULE_LOAD_DSO:error loading dso:conf_mod.c:285:module=ssl_conf, path=ssl_conf
> 140673035953984:error:0E076071:configuration file routines:MODULE_RUN:unknown module name:conf_mod.c:222:module=ssl_conf

Try adding this line to your `.env` ([source](https://github.com/bazelbuild/rules_closure/issues/351#issuecomment-854628326)):

```
OPENSSL_CONF=/dev/null
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

The easier to make it work is to go to `/:userSlug/admin/for-developers` on the frontend,
generate a personal token, and to add `?app_key=your_key_here` to all your requests.

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

## Deployment

Merging to `main` branch will auto-deploy the pdf service to Heroku.
