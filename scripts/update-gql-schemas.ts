import * as fs from 'fs';
import * as path from 'path';

import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';
import type { IntrospectionQuery } from 'graphql';
import fetch from 'node-fetch';

const getErrorMessage = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/**
 *
 * Fetch remote schema and turn it into string
 *
 * @param endpoint
 * @param options
 */
async function getRemoteSchema(
  endpoint: string,
): Promise<{ status: 'ok'; schema: string } | { status: 'err'; message: string }> {
  try {
    const introspectionQuery = getIntrospectionQuery({ inputValueDeprecation: true, schemaDescription: true });
    const { data, errors } = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    }).then(res => res.json() as Promise<{ data: IntrospectionQuery; errors?: unknown }>);

    if (errors) {
      return { status: 'err', message: JSON.stringify(errors, null, 2) };
    }

    // `buildClientSchema` validates the introspection result at runtime
    const schema = buildClientSchema(data);
    return {
      status: 'ok',
      schema: printSchema(schema),
    };
  } catch (err) {
    return { status: 'err', message: getErrorMessage(err) };
  }
}

/**
 *
 * Prints schema to file.
 *
 * @param dist
 * @param schema
 */
function printToFile(
  schema: string,
  filePath: string,
): { status: 'ok'; path: string } | { status: 'err'; message: string } {
  try {
    const output = path.resolve(process.cwd(), filePath);
    fs.writeFileSync(output, schema);
    return { status: 'ok', path: output };
  } catch (err) {
    console.error(getErrorMessage(err).slice(0, 100));
    return { status: 'err', message: getErrorMessage(err) };
  }
}

async function main(endpoint: string, filePath: string): Promise<void> {
  /* Fetch schema */
  const schema = await getRemoteSchema(endpoint);

  if (schema.status === 'err') {
    console.error(schema.message);
  } else {
    printToFile(schema.schema, filePath);
  }
}

main(process.argv[2], process.argv[3]);
