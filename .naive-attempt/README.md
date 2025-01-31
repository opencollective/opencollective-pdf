# OpenCollective PDF Service

A service for generating PDFs for various OpenCollective needs using React PDF renderer.

## Features

- Tax Forms PDF Generation
- Expense PDFs
- Gift Cards PDFs
- Collective Transaction PDFs
- Individual Transaction PDFs

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

For development:

```bash
npm run dev
```

## Available Routes

- `/tax-forms/:filename.pdf` - Generate tax form PDFs
- `/expenses/:id/:filename.pdf` - Generate expense PDFs
- `/gift-cards/:filename.pdf` - Generate gift card PDFs
- `/collectives/transactions/:fromSlug/:toSlug/:fromDate/:toDate` - Generate collective transaction PDFs
- `/transactions/:id` - Generate individual transaction PDFs

## Testing

Run the test suite:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Development

The project is built with:

- TypeScript
- Express.js
- React PDF Renderer
- Jest for testing
