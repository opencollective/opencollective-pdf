import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['server/**/*.(ts|tsx)', '!server/graphql/types/**/*'],
  importExtension: '.js',
  config: {
    defaultScalarType: 'any',
    namingConvention: {
      enumValues: 'keep', // Otherwise we end up with duplicate enum value, e.g. in PaymentMethodType where we have "creditcard" (deprecated) and "CREDITCARD"
    },
  },
  generates: {
    './server/graphql/types/v2/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
      },
      schema: './server/graphql/schemaV2.graphql',
    },
    // The client preset only emits operation types, so schema object types (Account, Expense, ...) are generated separately
    './server/graphql/types/v2/schema-types.ts': {
      schema: './server/graphql/schemaV2.graphql',
      plugins: [{ add: { content: '/* eslint-disable */' } }, 'typescript'],
      config: {
        defaultScalarType: 'any',
        enumsAsTypes: true, // Match the string unions emitted by the client preset, so enums from both files are compatible
        namingConvention: { enumValues: 'keep' },
      },
    },
  },
  pluckConfig: {
    globalGqlIdentifierName: 'gql',
    gqlMagicComment: 'GraphQLV2',
  },
};

// config file
// ts-unused-exports:disable-next-line
export default config;
