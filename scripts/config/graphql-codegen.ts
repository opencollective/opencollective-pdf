import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['server/**/*.(ts|tsx)', '!server/graphql/types/**/*'],
  emitLegacyCommonJSImports: false,
  config: {
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
  },
  pluckConfig: {
    globalGqlIdentifierName: 'gql',
    gqlMagicComment: 'GraphQLV2',
  },
};

// config file
// ts-unused-exports:disable-next-line
export default config;
